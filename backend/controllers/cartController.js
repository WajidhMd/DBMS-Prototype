import jwt from 'jsonwebtoken';
import {
  getCartByCustomerId,
  addToCart as addItemToCart,
  updateCartItemQuantity,
  removeFromCart as removeItemFromCart,
  clearCart as emptyCart,
  mergeCartItems,
  validateCouponCode
} from '../services/dbAdapter.js';

export async function getCart(req, res) {
  try {
    const customerId = req.user.ref_id;
    if (!customerId) return res.status(400).json({ error: 'Customer profile required for cart operations.' });
    const cart = await getCartByCustomerId(customerId, req.dbType);
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch cart.' });
  }
}

export async function addToCart(req, res) {
  try {
    const customerId = req.user.ref_id;
    const { product_id, quantity, attributes } = req.body;
    if (!product_id) return res.status(400).json({ error: 'Product ID is required.' });

    const updatedCart = await addItemToCart(customerId, product_id, quantity || 1, req.dbType, attributes);
    return res.json(updatedCart);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add item to cart.' });
  }
}

export async function updateCartItem(req, res) {
  try {
    const customerId = req.user.ref_id;
    const productId = req.params.id;
    const { quantity } = req.body;

    const updatedCart = await updateCartItemQuantity(customerId, productId, quantity, req.dbType);
    return res.json(updatedCart);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update cart item quantity.' });
  }
}

export async function removeFromCart(req, res) {
  try {
    const customerId = req.user.ref_id;
    const productId = req.params.id;
    const updatedCart = await removeItemFromCart(customerId, productId, req.dbType);
    return res.json(updatedCart);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to remove product from cart.' });
  }
}

export async function clearCart(req, res) {
  try {
    const customerId = req.user.ref_id;
    const updatedCart = await emptyCart(customerId, req.dbType);
    return res.json(updatedCart);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to clear cart.' });
  }
}

export async function syncCart(req, res) {
  try {
    const customerId = req.user.ref_id;
    if (!customerId) return res.status(400).json({ error: 'Customer profile required for cart synchronization.' });
    const { items } = req.body;
    const updatedCart = await mergeCartItems(customerId, items || [], req.dbType);
    return res.json(updatedCart);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to synchronize cart.' });
  }
}

export async function validateCoupon(req, res) {
  try {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, error: 'Please enter a coupon code.' });
    }

    let customerId = req.user?.ref_id || req.body?.customerId || req.query?.customerId;
    if (!customerId && req.headers['authorization']) {
      const token = req.headers['authorization'].split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ecommerce_dbms_secret_key_2026');
          customerId = decoded.ref_id;
        } catch (_) {}
      }
    }

    const result = await validateCouponCode(code, cartTotal, customerId, req.dbType);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ valid: false, error: err.message || 'Failed to validate coupon code.' });
  }
}
