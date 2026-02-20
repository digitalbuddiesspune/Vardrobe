import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getMyOrders, getOrderById } from '../controllers/order.controller.js';

const router = Router();

// GET /api/orders - list current user's orders
router.get('/', auth, getMyOrders);

// GET /api/orders/:id - get a specific order (owned by user)
router.get('/:id', auth, getOrderById);

export default router;
