import React, { useState } from 'react';
import api from '../services/api';
import { X, Star, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReviewModal({ product, orderId, existingReview, onClose, onSuccess }) {
  const isEditing = !!existingReview;
  const [rating, setRating] = useState(existingReview ? existingReview.rating : 5);
  const [description, setDescription] = useState(existingReview ? existingReview.description : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      let res;
      if (isEditing) {
        res = await api.put(`/reviews/${existingReview.review_id}`, {
          rating: parseInt(rating),
          description
        });
        alert('Review updated successfully!');
      } else {
        res = await api.post('/reviews', {
          product_id: product.product_id,
          rating: parseInt(rating),
          description
        });
        alert('Review submitted successfully!');
      }
      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '500px',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={22} color="#f59e0b" fill="#f59e0b" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {isEditing ? 'Edit Product Review' : 'Customer Feedback & Rating'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Product: <strong style={{ color: 'var(--text-primary)' }}>{product?.product_name}</strong>
        </p>

        {error && (
          <div className="error-banner" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Star Rating Select */}
          <div className="form-group">
            <label className="form-label">Rating (1 to 5 Stars)</label>
            <div style={{ display: 'flex', gap: '0.5rem', margin: '0.5rem 0' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  <Star
                    size={28}
                    color="#f59e0b"
                    fill={s <= rating ? '#f59e0b' : 'none'}
                  />
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Selected: <strong>{rating} Stars</strong>
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Review / Feedback Message</label>
            <textarea
              className="form-input"
              rows="4"
              placeholder="Tell other shoppers about the quality, delivery speed, and experience..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary-outline"
              style={{ width: 'auto' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-block"
              style={{ width: 'auto', marginTop: 0 }}
            >
              {loading ? 'Submitting...' : isEditing ? 'Save Changes' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
