import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
  validateCoupon
} from '../controllers/cartController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Guest coupon validation
router.post('/coupon', validateCoupon);

router.use(authenticateToken, authorizeRoles('CUSTOMER'));

router.get('/', getCart);
router.post('/', addToCart);
router.post('/sync', syncCart);
router.put('/:id', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/:id', removeFromCart);

export default router;
