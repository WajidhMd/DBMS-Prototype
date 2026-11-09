import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import { ShoppingBag, ShoppingCart, Star, ArrowLeft, CheckCircle, AlertCircle, MessageSquare, Edit2, Trash2, Heart, Plus, Minus } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const { user, role } = useAuth();
  const { targetDb } = useDb();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);

  // Review Form state
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewDesc, setReviewDesc] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id, targetDb]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data || null);

      const revRes = await api.get(`/reviews?product_id=${id}`);
      setReviews(revRes.data || []);
    } catch (err) {
      console.error('Failed to load product details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock_qty <= 0) {
      setNotification({ message: 'Product is currently out of stock.', type: 'error' });
      return;
    }
    const res = await addToCart(product, quantity);
    if (res.success) {
      setNotification({ message: `Added ${quantity} × "${product.product_name}" to your cart!`, type: 'success' });
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handleStartEdit = (r) => {
    setEditingReviewId(r.review_id);
    setRating(r.rating);
    setReviewDesc(r.description);
    setReviewError('');
    setReviewSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setRating(5);
    setReviewDesc('');
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      alert('Review deleted.');
      fetchProductDetails();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete review.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!user || role !== 'CUSTOMER') {
      setReviewError('You must be logged in as a Customer to submit a review.');
      return;
    }

    try {
      setSubmittingReview(true);
      if (editingReviewId) {
        await api.put(`/reviews/${editingReviewId}`, {
          rating: parseInt(rating),
          description: reviewDesc
        });
        setReviewSuccess('Review updated successfully!');
        setEditingReviewId(null);
      } else {
        await api.post('/reviews', {
          product_id: product.product_id,
          rating: parseInt(rating),
          description: reviewDesc
        });
        setReviewSuccess('Review submitted successfully!');
      }
      setReviewDesc('');
      fetchProductDetails();
    } catch (err) {
      setReviewError(err.response?.data?.error || 'A customer can only review products from delivered orders.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading product details...</div>;
  }

  if (!product) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn-secondary-outline" style={{ display: 'inline-flex', marginTop: '1rem' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  const myReview = user && reviews.find(r => r.customer_id === user?.ref_id);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>

      {/* Main Product Spec Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {/* Product Image Container */}
        <div style={{
          backgroundColor: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          minHeight: '280px',
          maxHeight: '340px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-purple)',
          border: '1px solid var(--border-color)'
        }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.product_name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div style={{ display: product.image_url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
            <ShoppingBag size={80} opacity={0.5} />
          </div>
        </div>

        {/* Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-cyan">{product.category_name}</span>
              <span className="badge badge-success">Target: {targetDb.toUpperCase()}</span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>{product.product_name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>Brand: <strong style={{ color: 'var(--text-primary)' }}>{product.brand}</strong></span>
              <span>•</span>
              <span>Seller: <strong style={{ color: 'var(--text-primary)' }}>{product.seller_name}</strong></span>
            </div>

            {/* Average Rating Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={18} fill={star <= Math.round(product.avg_rating || 0) ? '#f59e0b' : 'none'} />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.avg_rating || '0.0'} / 5.0</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>({reviews.length} reviews)</span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-purple)', marginBottom: '1rem' }}>
              ₹{parseFloat(product.mrp).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span className={`badge ${product.stock_qty > 0 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                {product.stock_qty > 0 ? `In Stock (${product.stock_qty} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Notification Banner */}
            {notification && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: notification.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(21, 128, 61, 0.15)',
                  border: `1px solid ${notification.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(21, 128, 61, 0.3)'}`,
                  color: notification.type === 'error' ? '#f87171' : 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.88rem'
                }}
              >
                {notification.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                <span>{notification.message}</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity:</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.stock_qty <= 0}
                  style={{ padding: '0.4rem 0.75rem', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}
                  title="Decrease Quantity"
                >
                  <Minus size={13} />
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock_qty || 99}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(val, product.stock_qty || 99)));
                  }}
                  style={{ width: '45px', textAlign: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem' }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min((product.stock_qty || 99), quantity + 1))}
                  disabled={Boolean(product.stock_qty && quantity >= product.stock_qty) || product.stock_qty <= 0}
                  style={{ padding: '0.4rem 0.75rem', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}
                  title="Increase Quantity"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock_qty <= 0}
              className="btn-primary-block"
              style={{ padding: '0.85rem', marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              style={{
                padding: '0.85rem 1.15rem',
                backgroundColor: isWishlisted(product.product_id) ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card)',
                border: `1px solid ${isWishlisted(product.product_id) ? 'var(--color-primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-sm)',
                color: isWishlisted(product.product_id) ? 'var(--color-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title={isWishlisted(product.product_id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={18} fill={isWishlisted(product.product_id) ? 'var(--color-primary)' : 'none'} color="var(--color-primary)" />
              <span>{isWishlisted(product.product_id) ? 'Wishlisted' : 'Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem'
      }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={20} color="var(--accent-purple)" /> Verified Customer Reviews
        </h2>

        {/* Review Form (Only for Customer role, and allow editing existing) */}
        {role === 'CUSTOMER' && (
          <div style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {editingReviewId ? 'Edit Your Review' : myReview ? 'Your Submitted Review' : 'Write a Product Review'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Reviews can only be submitted for delivered purchases. Prevent duplicates: customer can update their existing review anytime.
            </p>

            {reviewError && <div className="error-banner">{reviewError}</div>}
            {reviewSuccess && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.65rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {reviewSuccess}
              </div>
            )}

            {myReview && !editingReviewId ? (
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={15} fill={s <= myReview.rating ? '#f59e0b' : 'none'} />
                      ))}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{myReview.rating}/5</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleStartEdit(myReview)}
                      className="btn-secondary-outline"
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(myReview.review_id)}
                      className="btn-secondary-outline"
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', color: '#ef4444', borderColor: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>"{myReview.description}"</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label className="form-label">Rating (1 to 5 Stars)</label>
                  <select className="form-input" value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value="3">⭐⭐⭐ (3 - Average)</option>
                    <option value="2">⭐⭐ (2 - Below Average)</option>
                    <option value="1">⭐ (1 - Poor)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Review Comment</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Share your experience with this product..."
                    value={reviewDesc}
                    onChange={(e) => setReviewDesc(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn-primary-block" style={{ width: 'auto', padding: '0.6rem 1.25rem', marginTop: 0 }} disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : editingReviewId ? 'Save Changes' : 'Submit Review'}
                  </button>
                  {editingReviewId && (
                    <button type="button" onClick={handleCancelEdit} className="btn-secondary-outline" style={{ width: 'auto' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No customer reviews yet for this product.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map(r => (
              <div
                key={r.review_id}
                style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{r.customer_name}</strong>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Verified Purchase</span>
                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={14} fill={star <= r.rating ? '#f59e0b' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.review_date}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>{r.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
