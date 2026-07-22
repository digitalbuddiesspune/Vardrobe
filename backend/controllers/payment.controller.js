import crypto from 'crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import { Address } from '../models/Address.js';
import {
  generateUpiQr,
  verifyAirpayOrder,
  verifyIpnSecureHash,
} from '../services/airpay.service.js';

function buildCartItems(cart) {
  return cart.items.map((i) => {
    const p = i.product;
    let base = 0;
    if (p && typeof p.price === 'number') {
      base = Number(p.price) || 0;
    } else {
      const mrp = Number(p?.mrp) || 0;
      const discountPercent = Number(p?.discountPercent) || 0;
      base = Math.round(mrp - (mrp * discountPercent) / 100) || 0;
    }
    return {
      product: p._id,
      quantity: i.quantity,
      price: base,
      size: i.size || undefined,
    };
  });
}

function computePayable(items) {
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shippingCharge = subtotal < 5000 ? 99 : 0;
  const tax = Math.round(subtotal * 0.05);
  return {
    subtotal,
    shippingCharge,
    tax,
    amount: subtotal + shippingCharge + tax,
  };
}

async function loadShippingAddress(userId) {
  const addr = await Address.findOne({ userId });
  if (!addr) return null;
  const {
    fullName,
    mobileNumber,
    pincode,
    locality,
    address,
    city,
    state,
    landmark,
    alternatePhone,
    addressType,
  } = addr;
  return {
    fullName,
    mobileNumber,
    pincode,
    locality,
    address,
    city,
    state,
    landmark,
    alternatePhone,
    addressType,
  };
}

function makeOrderId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `VR${stamp}${rand}`.slice(0, 30);
}

/** Airpay V3 — create UPI QR for checkout */
export const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const items = buildCartItems(cart);
    const { amount } = computePayable(items);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid cart amount' });
    }

    const shippingAddress = await loadShippingAddress(userId);
    if (!shippingAddress?.mobileNumber) {
      return res.status(400).json({
        error: 'Shipping address with mobile number is required before payment',
      });
    }

    const orderid = makeOrderId();
    const buyerPhone = shippingAddress.mobileNumber;
    const buyerEmail =
      req.body?.email ||
      req.body?.notes?.email ||
      `${buyerPhone}@vardrobe.customer`;

    const airpay = await generateUpiQr({
      orderid,
      amount,
      buyerPhone,
      buyerEmail,
    });

    if (!airpay.qrcode_string) {
      console.error('Airpay generateOrder missing QR:', airpay.raw);
      return res.status(502).json({
        error: 'Airpay did not return a UPI QR. Check merchant domain whitelist / credentials.',
        detail: airpay.raw,
      });
    }

    return res.json({
      gateway: 'airpay',
      version: 3,
      orderid: airpay.orderid,
      amount: airpay.amount,
      qrcode_string: airpay.qrcode_string,
      ap_transactionid: airpay.ap_transactionid,
      mercid: airpay.mercid,
    });
  } catch (err) {
    console.error('Airpay createOrder error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Failed to create Airpay order' });
  }
};

/** Airpay V3 — poll/verify payment then place order */
export const verifyPayment = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { orderid, ap_transactionid } = req.body || {};
    if (!orderid) {
      return res.status(400).json({ error: 'Missing orderid' });
    }

    // Idempotency: already created for this Airpay order
    const existing = await Order.findOne({ airpayOrderId: orderid, user: userId });
    if (existing) {
      return res.json({ success: true, order: existing, alreadyPaid: true });
    }

    const status = await verifyAirpayOrder({
      merchant_txn_id: orderid,
      processor_id: ap_transactionid || '',
    });

    if (status.pending) {
      return res.json({
        success: false,
        pending: true,
        statusCode: status.statusCode,
        message: status.message || 'Payment in process',
      });
    }

    if (!status.success) {
      return res.json({
        success: false,
        pending: false,
        statusCode: status.statusCode,
        message: status.message || 'Payment not completed',
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const items = buildCartItems(cart);
    const { amount } = computePayable(items);
    const shippingAddress = await loadShippingAddress(userId);

    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'paid',
      orderStatus: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'airpay',
      transactionId: status.apTransactionId || status.transactionId || orderid,
      airpayOrderId: orderid,
      airpayTransactionId: status.apTransactionId || ap_transactionid || '',
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    return res.json({ success: true, order });
  } catch (err) {
    console.error('Airpay verifyPayment error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Verification failed' });
  }
};

/** Airpay V3 IPN callback (server-to-server) */
export const airpayIpn = async (req, res) => {
  try {
    const fields = { ...(req.body || {}) };
    const orderid = fields.TRANSACTIONID || fields.merchant_txn_id || fields.ORDERID;
    const txnStatus = String(fields.TRANSACTIONSTATUS || '').trim();

    if (fields.ap_SecureHash && !verifyIpnSecureHash(fields)) {
      console.warn('Airpay IPN: invalid secure hash');
      return res.status(400).json({ status: 400, message: 'Invalid hash' });
    }

    if (txnStatus === '200' && orderid) {
      const existing = await Order.findOne({ airpayOrderId: orderid });
      if (!existing) {
        console.log('Airpay IPN success for unpaid orderid (awaiting client verify):', orderid);
      } else if (existing.paymentStatus !== 'paid') {
        existing.paymentStatus = 'paid';
        existing.status = 'paid';
        existing.orderStatus = existing.orderStatus === 'pending' ? 'confirmed' : existing.orderStatus;
        existing.airpayTransactionId =
          fields.APTRANSACTIONID || existing.airpayTransactionId;
        existing.transactionId =
          fields.APTRANSACTIONID || fields.TRANSACTIONID || existing.transactionId;
        await existing.save();
      }
    }

    return res.json({ status: 200, message: 'Success' });
  } catch (err) {
    console.error('Airpay IPN error:', err?.message || err);
    return res.status(500).json({ status: 500, message: 'Failed' });
  }
};

export const createCODOrder = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      console.error('COD Order: No userId found');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      console.error('COD Order: Cart is empty for user', userId);
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const items = buildCartItems(cart);
    const { amount } = computePayable(items);

    let shippingAddress = null;
    try {
      shippingAddress = await loadShippingAddress(userId);
    } catch (addrErr) {
      console.error('COD Order: Error fetching address:', addrErr?.message || addrErr);
    }

    if (!shippingAddress) {
      return res.status(400).json({
        error: 'Shipping address is required. Please save your delivery address first.',
      });
    }

    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    console.log('COD Order created successfully:', order._id);
    return res.json({ success: true, order });
  } catch (err) {
    console.error('Create COD order error:', err?.message || err);
    console.error('Stack:', err?.stack);
    return res.status(500).json({ error: err?.message || 'Failed to create COD order' });
  }
};
