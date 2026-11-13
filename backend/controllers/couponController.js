import { getActiveCoupons as fetchActiveCoupons, validateCouponCode } from '../services/dbAdapter.js';

export async function getActiveCoupons(req, res) {
  try {
    const coupons = await fetchActiveCoupons(req.dbType);
    return res.json(coupons);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch active coupons.' });
  }
}

export async function validateCoupon(req, res) {
  try {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, error: 'Please enter a coupon code.' });
    }

    const result = await validateCouponCode(code, cartTotal, req.dbType);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ valid: false, error: err.message || 'Invalid coupon code.' });
  }
}
