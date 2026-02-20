import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createOrUpdateAddress, getMyAddress, getAddressByUser, updateAddress, deleteAddress } from '../controllers/address.controller.js';

const router = Router();

router.get('/me', auth, getMyAddress);
router.post('/', auth, createOrUpdateAddress);
router.get('/:userId', auth, getAddressByUser);
router.put('/:id', auth, updateAddress);
router.delete('/:id', auth, deleteAddress);

export default router;
