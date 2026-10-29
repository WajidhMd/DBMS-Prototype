import {
  getReviewsByProductId,
  getAllReviews,
  getReviewsByCustomerId,
  createReview as insertReview,
  updateReview as modifyReview,
  deleteReview as removeReview,
  deleteReviewByCustomer,
  flagReview as flagReviewAdapter,
  hideReview as hideReviewAdapter,
  unhideReview as unhideReviewAdapter,
  getModerationLog as fetchModerationLog
} from '../services/dbAdapter.js';

// GET /api/reviews?product_id=...
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

// GET /api/reviews/my (Customer view own submitted reviews)
export async function getMyReviews(req, res) {
  try {
    const customerId = req.user.ref_id;
    if (!customerId) return res.status(400).json({ error: 'Customer identifier not found.' });

    const reviews = await getReviewsByCustomerId(customerId, req.dbType);
    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch customer reviews.' });
  }
}

// GET /api/reviews/admin (Admin and Employee review moderation list)
export async function getAllReviewsAdmin(req, res) {
  try {
    const reviews = await getAllReviews(req.dbType);
    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch moderation reviews.' });
  }
}

// POST /api/reviews (Customer submit review)
export async function createReview(req, res) {
  try {
    const customer_id = req.user.ref_id;
    const { product_id, rating, description } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ error: 'Product ID and rating (1-5) are required.' });
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

// PUT /api/reviews/:id (Customer edit their review)
export async function updateReview(req, res) {
  try {
    const customerId = req.user.ref_id;
    const { id } = req.params;
    const { rating, description } = req.body;

    const updated = await modifyReview(id, customerId, { rating, description }, req.dbType);
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to update review.' });
  }
}

// DELETE /api/reviews/:id (Customer or Admin delete review)
export async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    if (req.user.role === 'ADMIN') {
      await removeReview(id, req.dbType);
    } else if (req.user.role === 'CUSTOMER') {
      await deleteReviewByCustomer(id, req.user.ref_id, req.dbType);
    } else {
      return res.status(403).json({ error: 'Unauthorized to delete reviews.' });
    }
    return res.json({ message: 'Review deleted successfully.' });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to delete review.' });
  }
}

// POST /api/reviews/:id/flag (Admin or Employee flag review)
export async function flagReview(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const updated = await flagReviewAdapter(id, req.user.email, reason, req.dbType);
    return res.json({ message: 'Review flagged successfully.', review: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to flag review.' });
  }
}

// POST /api/reviews/:id/hide (Admin or Employee hide review)
export async function hideReview(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const updated = await hideReviewAdapter(id, req.user.email, reason, req.dbType);
    return res.json({ message: 'Review hidden successfully.', review: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to hide review.' });
  }
}

// POST /api/reviews/:id/unhide (Admin or Employee unhide review)
export async function unhideReview(req, res) {
  try {
    const { id } = req.params;
    const updated = await unhideReviewAdapter(id, req.user.email, req.dbType);
    return res.json({ message: 'Review restored successfully.', review: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to restore review.' });
  }
}

// GET /api/reviews/moderation-log (Admin or Employee view moderation audit)
export async function getModerationLog(req, res) {
  try {
    const log = await fetchModerationLog(req.dbType);
    return res.json(log);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch moderation log.' });
  }
}
