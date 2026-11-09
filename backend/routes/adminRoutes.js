import express from 'express';
import {
  getStats,
  getCustomers,
  getSellers,
  getPayments,
  getUsers,
  deleteUser,
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee
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

// Employee Management
router.get('/employees', getEmployees);
router.get('/employees/:id', getEmployee);
router.post('/employees', createEmployee);
router.put('/employees/:id', updateEmployee);
router.patch('/employees/:id/status', updateEmployeeStatus);
router.delete('/employees/:id', deleteEmployee);

export default router;

