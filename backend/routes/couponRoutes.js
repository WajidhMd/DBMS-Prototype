import express from 'express';
import { getActiveCoupons, validateCoupon, checkCouponUsage } from '../controllers/couponController.js';

const router = express.Router();

// Coupon discovery, validation & usage check
router.get('/active', getActiveCoupons);
router.post('/validate', validateCoupon);
router.get('/usage/:code', checkCouponUsage);

export default router;

