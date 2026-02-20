import { Router } from 'express';
import { 
  getHeaderData, 
  searchProducts,
  getCollectionCategories,
  getMenCategories,
  getWomenCategories,
  getBoysCategories,
  getGirlsCategories,
  getSishuCategories
} from '../controllers/header.controller.js';

const router = Router();

// Get all header data (categories, navigation, etc.)
router.get('/', getHeaderData);

// Search products
router.get('/search', searchProducts);

// Get categories for each main category
router.get('/categories/collection', getCollectionCategories);
router.get('/categories/men', getMenCategories);
router.get('/categories/women', getWomenCategories);
router.get('/categories/boys', getBoysCategories);
router.get('/categories/girls', getGirlsCategories);
router.get('/categories/sishu', getSishuCategories);

export default router;
