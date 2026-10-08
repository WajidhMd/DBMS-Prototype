import express from 'express';
import { register, login, getMe, getSampleAccounts } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.get('/sample-accounts', getSampleAccounts);

export default router;
