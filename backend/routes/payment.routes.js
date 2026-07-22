import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  createCODOrder,
  airpayIpn,
} from '../controllers/payment.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

// Airpay V3 UPI QR
router.post('/orders', auth, createOrder);
router.post('/verify', auth, verifyPayment);
router.post('/airpay/ipn', airpayIpn);

// COD
router.post('/cod', auth, createCODOrder);

export default router;
