import React, { useState } from 'react';
import api from '../services/api';
import { X, Truck, AlertCircle, CheckCircle, Package } from 'lucide-react';

export default function ShipReturnModal({ returnReq, onClose, onSuccess }) {
  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [confirmedHandover, setConfirmedHandover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!confirmedHandover) {
      setError('Please confirm that the product has been packed and handed over for return shipping.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/returns/${returnReq.return_id}/ship`, {
        courier_name: courierName || 'Standard Return Carrier',
        tracking_number: trackingNumber || `TRK-RET-${Math.floor(100000 + Math.random() * 900000)}`
      });

      alert('Return shipment initiated! The tracking timeline has updated and notifications have been dispatched to employee and seller.');
      if (onSuccess) onSuccess(res.data.return);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initiate return shipping.');
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
        maxWidth: '520px',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={22} color="var(--accent-purple)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Ship Approved Return</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Return ID: <strong>{returnReq.return_id}</strong> • Order: <strong>{returnReq.order_number}</strong>
        </p>

        {error && (
          <div className="error-banner" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Courier Service / Shipping Carrier</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. FedEx, UPS, DHL, Postal Express"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tracking / Consignment Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. TRK9832104"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </div>

          <div style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', fontSize: '0.88rem' }}>
              <input
                type="checkbox"
                checked={confirmedHandover}
                onChange={(e) => setConfirmedHandover(e.target.checked)}
                style={{ marginTop: '0.2rem' }}
              />
              <span style={{ color: 'var(--text-primary)' }}>
                I confirm that the returned item(s) have been securely packed and handed over to the courier for return transit.
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
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
              disabled={loading || !confirmedHandover}
              className="btn-primary-block"
              style={{ width: 'auto', marginTop: 0 }}
            >
              {loading ? 'Confirming Shipment...' : 'Confirm & Dispatch Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
