import express from 'express';
import {
  getReviews,
  getMyReviews,
  getAllReviewsAdmin,
  createReview,
  updateReview,
  deleteReview,
  flagReview,
  hideReview,
  unhideReview,
  getModerationLog
} from '../controllers/reviewController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getReviews);

// Customer specific
router.get('/my', authenticateToken, authorizeRoles('CUSTOMER'), getMyReviews);
router.post('/', authenticateToken, authorizeRoles('CUSTOMER'), createReview);
router.put('/:id', authenticateToken, authorizeRoles('CUSTOMER'), updateReview);

// Moderation & Admin/Employee
router.get('/admin', authenticateToken, authorizeRoles('ADMIN', 'EMPLOYEE'), getAllReviewsAdmin);
router.get('/moderation-log', authenticateToken, authorizeRoles('ADMIN', 'EMPLOYEE'), getModerationLog);
router.post('/:id/flag', authenticateToken, authorizeRoles('ADMIN', 'EMPLOYEE'), flagReview);
router.post('/:id/hide', authenticateToken, authorizeRoles('ADMIN', 'EMPLOYEE'), hideReview);
router.post('/:id/unhide', authenticateToken, authorizeRoles('ADMIN', 'EMPLOYEE'), unhideReview);

// Delete (Customer deletes own, Admin can delete any)
router.delete('/:id', authenticateToken, authorizeRoles('CUSTOMER', 'ADMIN'), deleteReview);

export default router;
