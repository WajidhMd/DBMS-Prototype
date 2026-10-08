import {
  getReviewsByProductId,
  createReview as insertReview,
  deleteReview as removeReview
} from '../services/dbAdapter.js';

export async function getReviews(req, res) {
  try {
    const { product_id } = req.query;
    if (!product_id) return res.status(400).json({ error: 'product_id parameter is required.' });

    const reviews = await getReviewsByProductId(product_id, req.dbType);
    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
}

export async function createReview(req, res) {
  try {
    const customer_id = req.user.ref_id;
    const { product_id, rating, description } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ error: 'Product ID and rating rating (1-5) are required.' });
    }

    const review = await insertReview({
      customer_id,
      product_id,
      rating,
      description: description || ''
    }, req.dbType);

    return res.status(201).json(review);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to submit review.' });
  }
}

export async function deleteReview(req, res) {
  try {
    await removeReview(req.params.id, req.dbType);
    return res.json({ message: 'Review deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete review.' });
  }
}
