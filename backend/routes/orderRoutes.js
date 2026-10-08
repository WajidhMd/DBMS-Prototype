import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  forwardToSeller,
  sellerConfirmOrder,
  requestShipping,
  markAsShipped,
  markAsDelivered,
  getHistory
} from '../controllers/orderController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', authorizeRoles('CUSTOMER', 'ADMIN'), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.get('/:id/history', getHistory);

// Specific Workflow Action Routes
router.post('/:id/forward', authorizeRoles('EMPLOYEE', 'ADMIN'), forwardToSeller);
router.post('/:id/seller-confirm', authorizeRoles('SELLER', 'ADMIN'), sellerConfirmOrder);
router.post('/:id/request-shipping', authorizeRoles('SELLER', 'ADMIN'), requestShipping);
router.post('/:id/mark-shipped', authorizeRoles('EMPLOYEE', 'ADMIN'), markAsShipped);
router.post('/:id/mark-delivered', authorizeRoles('EMPLOYEE', 'ADMIN'), markAsDelivered);

router.put('/:id/status', authorizeRoles('EMPLOYEE', 'SELLER', 'ADMIN'), updateOrderStatus);

export default router;
