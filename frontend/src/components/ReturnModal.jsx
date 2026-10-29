import React, { useState } from 'react';
import api from '../services/api';
import { X, RotateCcw, AlertCircle, CheckCircle, Package, Image as ImageIcon } from 'lucide-react';

export default function ReturnModal({ order, onClose, onSuccess }) {
  const [selectedItems, setSelectedItems] = useState({});
  const [reason, setReason] = useState('Damaged product');
  const [comments, setComments] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validReasons = [
    'Damaged product',
    'Wrong product delivered',
    'Defective product',
    'Product does not match the description',
    'Other'
  ];

  const handleCheckboxChange = (product_id, maxQty) => {
    setSelectedItems(prev => {
      const copy = { ...prev };
      if (copy[product_id]) {
        delete copy[product_id];
      } else {
        copy[product_id] = 1;
      }
      return copy;
    });
  };

  const handleQtyChange = (product_id, qty, maxQty) => {
    const val = Math.min(Math.max(1, parseInt(qty) || 1), maxQty);
    setSelectedItems(prev => ({
      ...prev,
      [product_id]: val
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const itemKeys = Object.keys(selectedItems);
    if (itemKeys.length === 0) {
      setError('Please select at least one product item to return.');
      return;
    }

    const items = itemKeys.map(prodId => ({
      product_id: prodId,
      quantity: selectedItems[prodId]
    }));

    try {
      setLoading(true);
      const res = await api.post('/returns', {
        order_id: order.order_id,
        items,
        reason,
        comments,
        image_url: imageUrl
      });

      alert(`Return Request ${res.data.return_id} submitted successfully! Our employee team will review and approve your request shortly.`);
      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit return request.');
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
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCcw size={22} color="var(--accent-purple)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Request Product Return</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Order: <strong>{order.order_number}</strong> • Ordered: {order.order_date}
        </p>

        {error && (
          <div className="error-banner" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Purchased Items Selection */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>Select Products & Quantity to Return</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {order.items?.map(item => {
                const isChecked = !!selectedItems[item.product_id];
                return (
                  <div
                    key={item.product_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--bg-input)',
                      border: `1px solid ${isChecked ? 'var(--accent-purple)' : 'var(--border-color)'}`,
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(item.product_id, item.quantity)}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.product_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Brand: {item.brand} • Purchased: {item.quantity} units @ ${parseFloat(item.unit_price).toFixed(2)}
                        </div>
                      </div>
                    </label>

                    {isChecked && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty:</span>
                        <input
                          type="number"
                          min="1"
                          max={item.quantity}
                          value={selectedItems[item.product_id] || 1}
                          onChange={(e) => handleQtyChange(item.product_id, e.target.value, item.quantity)}
                          style={{
                            width: '55px',
                            padding: '0.3rem',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: '#fff',
                            borderRadius: 'var(--radius-sm)',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reason */}
          <div className="form-group">
            <label className="form-label">Reason for Return</label>
            <select
              className="form-input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              {validReasons.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Additional Comments */}
          <div className="form-group">
            <label className="form-label">Additional Comments / Problem Description</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Provide specific details about the issue..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            ></textarea>
          </div>

          {/* Optional Product Image URL */}
          <div className="form-group">
            <label className="form-label">Proof / Image URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://... photo of damaged/defective product"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
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
              {loading ? 'Submitting Request...' : 'Submit Return Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
