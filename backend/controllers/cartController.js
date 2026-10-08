import {
  getCartByCustomerId,
  addToCart as addItemToCart,
  updateCartItemQuantity,
  removeFromCart as removeItemFromCart,
  clearCart as emptyCart
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
