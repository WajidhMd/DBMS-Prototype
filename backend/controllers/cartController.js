import {
  getCartByCustomerId,
  addToCart as addItemToCart,
  updateCartItemQuantity,
  removeFromCart as removeItemFromCart,
  clearCart as emptyCart,
  mergeCartItems
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
    const { product_id, quantity } = req.body;
    if (!product_id) return res.status(400).json({ error: 'Product ID is required.' });

    const updatedCart = await addItemToCart(customerId, product_id, quantity || 1, req.dbType);
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

const PROMO_COUPONS = {
  JMART20: { code: 'JMART20', type: 'percentage', value: 20, maxDiscount: 1000, minCart: 500, description: '20% OFF up to ₹1,000 on orders over ₹500' },
  GOLD500: { code: 'GOLD500', type: 'flat', value: 500, minCart: 2000, description: 'Flat ₹500 OFF on orders above ₹2,000' },
  FESTIVE10: { code: 'FESTIVE10', type: 'percentage', value: 10, maxDiscount: 500, minCart: 0, description: 'Festive 10% OFF on all orders' },
  WELCOME100: { code: 'WELCOME100', type: 'flat', value: 100, minCart: 300, description: 'Flat ₹100 Welcome Discount on orders above ₹300' }
};

export async function validateCoupon(req, res) {
  try {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, error: 'Please enter a coupon code.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = PROMO_COUPONS[cleanCode];

    if (!coupon) {
      return res.status(400).json({ valid: false, error: `Invalid coupon code '${cleanCode}'. Try 'JMART20' or 'GOLD500'.` });
    }

    const subtotal = Number(cartTotal) || 0;
    if (subtotal < coupon.minCart) {
      return res.status(400).json({
        valid: false,
        error: `Coupon '${coupon.code}' requires a minimum order subtotal of ₹${coupon.minCart}. Add ₹${(coupon.minCart - subtotal).toFixed(0)} more!`
      });
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    return res.json({
      valid: true,
      code: coupon.code,
      discountAmount,
      description: coupon.description,
      finalTotal: Math.max(0, subtotal - discountAmount)
    });
  } catch (err) {
    return res.status(500).json({ valid: false, error: 'Failed to validate coupon code.' });
  }
}
