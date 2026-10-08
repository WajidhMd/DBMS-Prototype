import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, authorizeRoles('SELLER', 'ADMIN'), createProduct);
router.put('/:id', authenticateToken, authorizeRoles('SELLER', 'ADMIN'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('SELLER', 'ADMIN'), deleteProduct);

export default router;
