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
  getHistory,
  assignOrder,
  cancelOrder,
  exchangeOrder
} from '../controllers/orderController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', authorizeRoles('CUSTOMER', 'ADMIN'), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.get('/:id/history', getHistory);

// Customer Post-Purchase Lifecycle: Cancellation & Exchange
router.post('/:id/cancel', authorizeRoles('CUSTOMER', 'ADMIN'), cancelOrder);
router.post('/:id/exchange', authorizeRoles('CUSTOMER', 'ADMIN'), exchangeOrder);

// Specific Workflow Action Routes
router.post('/:id/forward', authorizeRoles('EMPLOYEE', 'ADMIN'), forwardToSeller);
router.post('/:id/seller-confirm', authorizeRoles('SELLER', 'ADMIN'), sellerConfirmOrder);
router.post('/:id/request-shipping', authorizeRoles('SELLER', 'ADMIN'), requestShipping);
router.post('/:id/mark-shipped', authorizeRoles('EMPLOYEE', 'ADMIN'), markAsShipped);
router.post('/:id/mark-delivered', authorizeRoles('EMPLOYEE', 'ADMIN'), markAsDelivered);
router.put('/:id/assign', authorizeRoles('EMPLOYEE', 'ADMIN'), assignOrder);
router.post('/:id/assign', authorizeRoles('EMPLOYEE', 'ADMIN'), assignOrder);

router.put('/:id/status', authorizeRoles('EMPLOYEE', 'SELLER', 'ADMIN'), updateOrderStatus);

export default router;
