import express from 'express';
import {
  getReviews,
  createReview,
  deleteReview
} from '../controllers/reviewController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', authenticateToken, authorizeRoles('CUSTOMER'), createReview);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), deleteReview);

export default router;
