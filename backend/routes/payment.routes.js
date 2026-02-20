import { Router } from 'express';
import { createOrder, verifyPayment, createCODOrder } from '../controllers/payment.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/orders', createOrder);
router.post('/verify', auth, verifyPayment);
router.post('/cod', auth, createCODOrder);

export default router;
