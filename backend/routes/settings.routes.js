import { Router } from 'express';
import { getLogo, getHeroSlider } from '../controllers/admin.controller.js';

const router = Router();

// Public endpoint to get logo settings (no auth required)
router.get('/logo', getLogo);

// Public endpoint to get hero slider settings (no auth required)
router.get('/hero-slider', getHeroSlider);

export default router;

