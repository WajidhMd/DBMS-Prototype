import jwt from 'jsonwebtoken';
import {
  getActiveCoupons as fetchActiveCoupons,
  validateCouponCode,
  hasCustomerUsedCoupon
} from '../services/dbAdapter.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce_dbms_secret_key_2026';

function extractCustomerId(req) {
  if (req.user?.ref_id) return req.user.ref_id;
  if (req.body?.customerId) return req.body.customerId;
  if (req.query?.customerId) return req.query.customerId;
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.ref_id;
      } catch (_) { }
    }
  }
  return null;
}

export async function getActiveCoupons(req, res) {
  try {
    const customerId = extractCustomerId(req);
    const coupons = await fetchActiveCoupons(req.dbType, customerId);
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

    const customerId = extractCustomerId(req);
    const result = await validateCouponCode(code, cartTotal, customerId, req.dbType);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ valid: false, error: err.message || 'Invalid coupon code.' });
  }
}

export async function checkCouponUsage(req, res) {
  try {
    const { code } = req.params;
    const customerId = extractCustomerId(req);
    if (!customerId) {
      return res.json({ used: false });
    }
    const used = await hasCustomerUsedCoupon(customerId, code, req.dbType);
    return res.json({ used, code });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to check coupon status.' });
  }
}

