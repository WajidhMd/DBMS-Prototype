import express from 'express';
import {
  getStats,
  getCustomers,
  getSellers,
  getPayments,
  getUsers,
  deleteUser
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken, authorizeRoles('ADMIN'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/customers', getCustomers);
router.get('/sellers', getSellers);
router.get('/payments', getPayments);

export default router;

