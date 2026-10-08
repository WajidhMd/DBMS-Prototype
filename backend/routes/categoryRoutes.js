import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticateToken, authorizeRoles('ADMIN'), createCategory);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), updateCategory);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), deleteCategory);

export default router;
