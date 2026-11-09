import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  syncWishlist
} from '../controllers/wishlistController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.post('/sync', syncWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;

