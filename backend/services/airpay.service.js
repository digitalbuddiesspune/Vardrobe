import crypto from 'crypto';

const GENERATE_ORDER_URL = 'https://kraken.airpay.co.in/airpay/api/generateOrder';
const VERIFY_ORDER_URL = 'https://kraken.airpay.co.in/airpay/order/verify.php';

function requireConfig() {
  const mercid = process.env.AIRPAY_MERCHANT_ID || '';
  const username = process.env.AIRPAY_USERNAME || '';
  const password = process.env.AIRPAY_PASSWORD || '';
  const secret = process.env.AIRPAY_SECRET || '';
  if (!mercid || !username || !password || !secret) {
    throw new Error('Airpay V3 credentials not configured');
  }
  return { mercid, username, password, secret };
}

function todayYmd() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getEncKey(secret) {
  // Matches PHP: md5($secret) → 32-char hex string used as AES-256 key
  return crypto.createHash('md5').update(secret).digest('hex');
}

function getKey256(username, password) {
  return crypto.createHash('sha256').update(`${username}~:~${password}`).digest('hex');
}

function getPrivateKey(secret, username, password) {
  return crypto.createHash('sha256').update(`${secret}@${username}:|:${password}`).digest('hex');
}

function encryptPayload(jsonData, secret) {
  const encKey = getEncKey(secret);
  const iv = crypto.randomBytes(8).toString('hex'); // 16 chars
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(encKey, 'utf8'),
    Buffer.from(iv, 'utf8')
  );
  const raw = Buffer.concat([cipher.update(jsonData, 'utf8'), cipher.final()]);
  return iv + raw.toString('base64');
}

function decryptPayload(encryptedData, secret) {
  if (!encryptedData || typeof encryptedData !== 'string') {
    throw new Error('Invalid encrypted response from Airpay');
  }
  const encKey = getEncKey(secret);
  const iv = encryptedData.substring(0, 16);
  const data = encryptedData.substring(16);
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(encKey, 'utf8'),
    Buffer.from(iv, 'utf8')
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

function getMerchantDomain() {
  const raw =
    process.env.AIRPAY_MER_DOM ||
    (process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || 'https://vardrobe.in'
      : 'http://localhost');
  return Buffer.from(String(raw).replace(/\/$/, ''), 'utf8').toString('base64');
}

function xmlTag(body, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = String(body || '').match(re);
  return m ? m[1].trim() : null;
}

function parseVerifyBody(body) {
  const text = String(body || '').trim();
  if (!text) return {};

  try {
    const json = JSON.parse(text);
    const data = json.data || json.DATA || json;
    return {
      TRANSACTIONSTATUS:
        data.TRANSACTIONSTATUS ||
        data.transaction_status ||
        data.transactionStatus ||
        json.TRANSACTIONSTATUS ||
        json.status,
      TRANSACTIONPAYMENTSTATUS:
        data.TRANSACTIONPAYMENTSTATUS ||
        data.transaction_payment_status ||
        data.TRANSACTIONPAYMENTSTATUS,
      APTRANSACTIONID:
        data.APTRANSACTIONID ||
        data.ap_transactionid ||
        data.apTransactionId,
      TRANSACTIONID: data.TRANSACTIONID || data.transactionid,
      AMOUNT: data.AMOUNT || data.amount,
      MESSAGE: data.MESSAGE || data.message || json.message,
      raw: json,
    };
  } catch {
    // Airpay V3 verify often returns XML
  }

  return {
    TRANSACTIONSTATUS: xmlTag(text, 'TRANSACTIONSTATUS'),
    TRANSACTIONPAYMENTSTATUS: xmlTag(text, 'TRANSACTIONPAYMENTSTATUS'),
    APTRANSACTIONID: xmlTag(text, 'APTRANSACTIONID'),
    TRANSACTIONID: xmlTag(text, 'TRANSACTIONID'),
    AMOUNT: xmlTag(text, 'AMOUNT'),
    MESSAGE: xmlTag(text, 'MESSAGE'),
    raw: text,
  };
}

/**
 * Airpay V3 — Generate dynamic UPI QR
 * Docs: https://docs.airpay.co.in/v3/upi/generate-qr/
 */
export async function generateUpiQr({
  orderid,
  amount,
  buyerPhone,
  buyerEmail,
}) {
  const { mercid, username, password, secret } = requireConfig();
  const amt = Number(amount).toFixed(2);
  const mer_dom = getMerchantDomain();
  const call_type = 'upiqr';

  const fields = {
    mercid,
    orderid,
    amount: amt,
    buyerPhone: String(buyerPhone || '').replace(/\D/g, '').slice(-10),
    buyerEmail: buyerEmail || 'customer@vardrobe.in',
    mer_dom,
    call_type,
  };

  if (!fields.buyerPhone || fields.buyerPhone.length !== 10) {
    throw new Error('Valid 10-digit buyer phone is required for UPI QR');
  }

  const alldata =
    `${fields.mercid}${fields.orderid}${fields.amount}` +
    `${fields.buyerPhone}${fields.buyerEmail}${fields.mer_dom}${fields.call_type}`;

  const key256 = getKey256(username, password);
  const checksum = crypto
    .createHash('sha256')
    .update(`${key256}@${alldata}${todayYmd()}`)
    .digest('hex');

  const encData = encryptPayload(JSON.stringify(fields), secret);

  const res = await fetch(GENERATE_ORDER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encData, checksum, mercid }),
  });

  const responseText = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error(`Airpay generateOrder invalid response: ${responseText.slice(0, 200)}`);
  }

  if (!parsed?.data) {
    const msg = parsed?.message || parsed?.status || 'Airpay generateOrder failed';
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  const decrypted = decryptPayload(parsed.data, secret);
  let payload;
  try {
    payload = JSON.parse(decrypted);
  } catch {
    payload = { raw: decrypted };
  }

  const qrcode_string =
    payload.qrcode_string ||
    payload.QRCODE_STRING ||
    payload.qrCode ||
    payload.qr_string ||
    null;

  const ap_transactionid =
    payload.ap_transactionid ||
    payload.APTRANSACTIONID ||
    payload.apTransactionId ||
    payload.RID ||
    null;

  const status = payload.status || parsed.status;
  if (!qrcode_string) {
    const errMsg =
      payload.error ||
      payload.message ||
      payload.errCode ||
      (status && String(status) !== '200' ? `Airpay error (status ${status})` : null);
    if (errMsg) {
      throw new Error(
        typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)
      );
    }
  }

  return {
    orderid,
    amount: amt,
    mercid,
    qrcode_string,
    ap_transactionid,
    status,
    raw: payload,
  };
}

/**
 * Airpay V3 — Order confirmation / status pull
 * Docs: https://docs.airpay.co.in/v3/order-comfirmation/order-comfirmation/
 */
export async function verifyAirpayOrder({
  merchant_txn_id,
  processor_id = '',
  rrn = '',
  terminal_id = '',
  txn_type = '',
}) {
  const { mercid, username, password, secret } = requireConfig();
  const private_key = getPrivateKey(secret, username, password);
  const date = todayYmd();

  const alldata =
    `${mercid}${merchant_txn_id || ''}${processor_id || ''}` +
    `${rrn || ''}${terminal_id || ''}${txn_type || ''}${date}`;

  const key = getKey256(username, password);
  const checksum = crypto.createHash('sha256').update(`${key}@${alldata}`).digest('hex');

  const form = new URLSearchParams();
  form.set('merchant_id', mercid);
  if (merchant_txn_id) form.set('merchant_txn_id', merchant_txn_id);
  if (processor_id) form.set('processor_id', String(processor_id));
  if (rrn) form.set('rrn', String(rrn));
  if (terminal_id) form.set('terminal_id', String(terminal_id));
  if (txn_type) form.set('txn_type', txn_type);
  form.set('private_key', private_key);
  form.set('checksum', checksum);

  const res = await fetch(VERIFY_ORDER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  const body = await res.text();
  const parsed = parseVerifyBody(body);
  const statusCode = String(parsed.TRANSACTIONSTATUS || '').trim();
  const paymentStatus = String(parsed.TRANSACTIONPAYMENTSTATUS || '').trim().toLowerCase();

  const success =
    statusCode === '200' ||
    paymentStatus === 'success' ||
    paymentStatus === 'capture' ||
    paymentStatus === 'authorize';

  const pending =
    statusCode === '211' ||
    paymentStatus === 'inprocess' ||
    paymentStatus === 'incomplete';

  return {
    success,
    pending,
    statusCode,
    paymentStatus,
    apTransactionId: parsed.APTRANSACTIONID,
    transactionId: parsed.TRANSACTIONID,
    amount: parsed.AMOUNT,
    message: parsed.MESSAGE,
    raw: parsed.raw,
  };
}

export function verifyIpnSecureHash(fields = {}) {
  const { username, password } = requireConfig();
  // Common Airpay IPN hash pattern (fields may vary by product)
  const {
    TRANSACTIONID = '',
    APTRANSACTIONID = '',
    AMOUNT = '',
    TRANSACTIONSTATUS = '',
    MESSAGE = '',
    MERCID = '',
    CHMODE = '',
    CUSTOMVAR = '',
    ap_SecureHash,
  } = fields;

  const key = getKey256(username, password);
  const data =
    `${TRANSACTIONID}:${APTRANSACTIONID}:${AMOUNT}:` +
    `${TRANSACTIONSTATUS}:${MESSAGE}:${MERCID}:${CHMODE || fields.CHMOD || ''}:${CUSTOMVAR}`;
  const expected = crypto.createHash('sha256').update(`${key}@${data}`).digest('hex');
  return String(ap_SecureHash || '').toLowerCase() === expected.toLowerCase();
}
