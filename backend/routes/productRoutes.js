import express from 'express';
import {
  getProducts,
  getProductById,
  getSearchSuggestions,
  getProductQA,
  postProductQuestion,
  subscribeStockAlert,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/suggestions', getSearchSuggestions);
router.get('/:id/qa', getProductQA);
router.post('/:id/qa', authenticateToken, postProductQuestion);
router.post('/:id/notify', subscribeStockAlert);

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, authorizeRoles('SELLER', 'ADMIN'), createProduct);
router.put('/:id', authenticateToken, authorizeRoles('SELLER', 'ADMIN'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('SELLER', 'ADMIN'), deleteProduct);

export default router;
