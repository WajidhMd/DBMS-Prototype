import express from 'express';
import { checkPincodeDeliverability, getOrderTrackingInfo } from '../controllers/logisticsController.js';

const router = express.Router();

router.get('/pincode/:code', checkPincodeDeliverability);
router.get('/tracking/:orderId', getOrderTrackingInfo);

export default router;
