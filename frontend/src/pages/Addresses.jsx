import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import { MapPin, Plus, Trash2, CheckCircle } from 'lucide-react';

export default function Addresses() {
  const { targetDb } = useDb();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Address Modal
  const [showModal, setShowModal] = useState(false);
  const [addrForm, setAddrForm] = useState({
    street: '',
    apartment_no: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, [targetDb]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/addresses');
      setAddresses(res.data || []);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/addresses', addrForm);
      setShowModal(false);
      setAddrForm({ street: '', apartment_no: '', city: '', state: '', pincode: '', is_default: false });
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      alert('Failed to delete address.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <span className={`badge badge-${targetDb}`}>TARGET: {targetDb.toUpperCase()}</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>My Shipping Addresses</h1>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary-block" style={{ width: 'auto', padding: '0.6rem 1.1rem' }}>
          <Plus size={16} /> Add Address
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center' }}>
          <MapPin size={40} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
          <h3>No Shipping Addresses Stored</h3>
          <button onClick={() => setShowModal(true)} className="btn-primary-block" style={{ width: 'auto', display: 'inline-flex', marginTop: '1rem' }}>
            Add Shipping Address
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {addresses.map(a => (
            <div
              key={a.address_id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{a.street}</strong>
                  {a.is_default && <span className="badge badge-success">DEFAULT</span>}
                </div>
                {a.apartment_no && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{a.apartment_no}</p>}
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {a.city}, {a.state} - <strong>{a.pincode}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <button onClick={() => handleDeleteAddress(a.address_id)} style={{ background: 'transparent', color: '#f87171' }} title="Delete Address">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Address</h3>
            <form onSubmit={handleAddAddress}>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  className="form-input"
                  value={addrForm.street}
                  onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Apartment / Suite No</label>
                <input
                  type="text"
                  className="form-input"
                  value={addrForm.apartment_no}
                  onChange={(e) => setAddrForm({ ...addrForm, apartment_no: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={addrForm.state}
                    onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={addrForm.pincode}
                    onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary-outline" style={{ width: 'auto' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-block" style={{ width: 'auto', marginTop: 0 }}>
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
