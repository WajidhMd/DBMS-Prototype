import {
  getWishlistByUserId,
  addToWishlist as addItemToWishlist,
  removeFromWishlist as removeItemFromWishlist,
  syncWishlist as mergeWishlistItems
} from '../services/dbAdapter.js';

export async function getWishlist(req, res) {
  try {
    const userId = req.user.user_id;
    if (!userId) return res.status(400).json({ error: 'User ID is required.' });
    const items = await getWishlistByUserId(userId, req.dbType);
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch wishlist.' });
  }
}

export async function addToWishlist(req, res) {
  try {
    const userId = req.user.user_id;
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: 'Product ID is required.' });

    const items = await addItemToWishlist(userId, product_id, req.dbType);
    return res.json(items);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to add item to wishlist.' });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const userId = req.user.user_id;
    const productId = req.params.productId;
    const items = await removeItemFromWishlist(userId, productId, req.dbType);
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to remove product from wishlist.' });
  }
}

export async function syncWishlist(req, res) {
  try {
    const userId = req.user.user_id;
    const { product_ids } = req.body;
    const items = await mergeWishlistItems(userId, product_ids || [], req.dbType);
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to sync wishlist.' });
  }
}

