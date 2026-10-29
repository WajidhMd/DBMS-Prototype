import express from 'express';
import { getNotifications, markRead, markAllRead } from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getNotifications);
router.post('/:id/read', markRead);
router.post('/mark-all-read', markAllRead);

export default router;
