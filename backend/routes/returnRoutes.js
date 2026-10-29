import express from 'express';
import {
  createReturn,
  getReturns,
  getReturnById,
  approveReturn,
  rejectReturn,
  shipReturn,
  markReturnInTransit,
  confirmReturnReceived,
  completeReturn,
  cancelReturn
} from '../controllers/returnController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// CRUD
router.post('/', authorizeRoles('CUSTOMER'), createReturn);
router.get('/', getReturns);
router.get('/:id', getReturnById);

// Workflow actions
router.post('/:id/approve', authorizeRoles('EMPLOYEE', 'ADMIN'), approveReturn);
router.post('/:id/reject', authorizeRoles('EMPLOYEE', 'ADMIN'), rejectReturn);
router.post('/:id/ship', authorizeRoles('CUSTOMER'), shipReturn);
router.post('/:id/in-transit', authorizeRoles('EMPLOYEE', 'ADMIN'), markReturnInTransit);
router.post('/:id/transit', authorizeRoles('EMPLOYEE', 'ADMIN'), markReturnInTransit);
router.post('/:id/received', authorizeRoles('SELLER', 'EMPLOYEE', 'ADMIN'), confirmReturnReceived);
router.post('/:id/complete', authorizeRoles('EMPLOYEE', 'ADMIN'), completeReturn);
router.post('/:id/cancel', authorizeRoles('CUSTOMER', 'ADMIN'), cancelReturn);

export default router;
