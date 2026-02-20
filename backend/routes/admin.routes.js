import { Router } from 'express';
import auth from '../middleware/auth.js';
import adminOnly from '../middleware/admin.js';
import { createProduct, adminListProducts, deleteProductById, adminListOrders, adminStats, adminListAddresses, updateProduct, updateOrderStatus, adminGetOrderById, getPolicy, getAllPolicies, updatePolicy, getLogo, updateLogo, getHeroSlider, updateHeroSlider } from '../controllers/admin.controller.js';

const router = Router();

// Products
router.post('/products', auth, adminOnly, createProduct);
router.get('/products', auth, adminOnly, adminListProducts);
router.patch('/products/:id', auth, adminOnly, updateProduct);
router.delete('/products/:id', auth, adminOnly, deleteProductById);

// Orders
router.get('/orders', auth, adminOnly, adminListOrders);
router.get('/orders/:id', auth, adminOnly, adminGetOrderById);
router.put('/orders/:id/status', auth, adminOnly, updateOrderStatus);
router.patch('/orders/:id', auth, adminOnly, updateOrderStatus);
router.put('/orders/:id', auth, adminOnly, updateOrderStatus);

// Stats
router.get('/stats', auth, adminOnly, adminStats);

// Addresses
router.get('/addresses', auth, adminOnly, adminListAddresses);

// Policies
router.get('/policies', auth, adminOnly, getAllPolicies);
router.get('/policies/:type', auth, adminOnly, getPolicy);
router.put('/policies/:type', auth, adminOnly, updatePolicy);
router.patch('/policies/:type', auth, adminOnly, updatePolicy);

// Logo/Settings
router.get('/logo', auth, adminOnly, getLogo);
router.put('/logo', auth, adminOnly, updateLogo);
router.patch('/logo', auth, adminOnly, updateLogo);

// Hero Slider
router.get('/hero-slider', auth, adminOnly, getHeroSlider);
router.put('/hero-slider', auth, adminOnly, updateHeroSlider);
router.patch('/hero-slider', auth, adminOnly, updateHeroSlider);

export default router;
