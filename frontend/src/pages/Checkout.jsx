import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import { MapPin, CreditCard, ShieldCheck, Plus, CheckCircle, ArrowLeft, FileText, ShoppingBag } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

export default function Checkout() {
  const { user } = useAuth();
  const { targetDb } = useDb();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMode, setPaymentMode] = useState('Credit/Debit Card');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Add Address Modal state
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [addrForm, setAddrForm] = useState({
    street: '',
    apartment_no: '',
    city: '',
    state: '',
    pincode: '',
    is_default: true
  });

  useEffect(() => {
    fetchCheckoutData();
  }, [targetDb]);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const [cartRes, addrRes] = await Promise.all([
        api.get('/cart'),
        api.get('/addresses')
      ]);

      setCart(cartRes.data || null);
      const addrList = addrRes.data || [];
      setAddresses(addrList);

      const defaultAddr = addrList.find(a => a.is_default) || addrList[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.address_id);
      }
    } catch (err) {
      console.error('Failed to load checkout data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/addresses', addrForm);
      setAddresses([...addresses, res.data]);
      setSelectedAddressId(res.data.address_id);
      setShowAddrModal(false);
      setAddrForm({ street: '', apartment_no: '', city: '', state: '', pincode: '', is_default: true });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedAddressId) {
      setError('Please select or add a shipping address.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/orders', {
        address_id: selectedAddressId,
        payment_mode: paymentMode
      });

      setCreatedOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Preparing checkout...</div>;
  }

  // Order Success View with Downloadable Invoice option
  if (createdOrder) {
    return (
      <div className="animate-fade-in" style={{ padding: '3rem 1rem', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--accent-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <CheckCircle size={40} />
          </div>

          <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
            PAYMENT COMPLETED & ORDER PLACED
          </span>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            Order Placed Successfully!
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            Your payment was processed successfully. Order status is now <strong style={{ color: 'var(--accent-purple)' }}>Order Placed</strong>. An employee will forward your order to the seller for confirmation.
          </p>

          <div style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '2rem',
            textAlign: 'left',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            fontSize: '0.9rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Order Reference</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--accent-purple)' }}>{createdOrder.order_number}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Total Paid</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--accent-green)' }}>${parseFloat(createdOrder.order_amount || 0).toFixed(2)}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Payment Method</span>
              <strong>{createdOrder.payment?.payment_mode || paymentMode}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Initial Status</span>
              <span className="badge badge-warning">Order Placed</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="btn-primary-block"
              style={{
                width: 'auto',
                marginTop: 0,
                padding: '0.75rem 1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--accent-purple)'
              }}
            >
              <FileText size={18} /> View & Download PDF Invoice
            </button>

            <button
              onClick={() => navigate('/orders')}
              className="btn-secondary-outline"
              style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
            >
              Go to My Orders
            </button>
          </div>
        </div>

        {/* Downloadable PDF Invoice Modal */}
        {showInvoiceModal && (
          <InvoiceModal
            order={createdOrder}
            onClose={() => setShowInvoiceModal(false)}
          />
        )}
      </div>
    );
  }

  const items = cart?.items || [];
  const grandTotal = cart?.grand_total || 0;

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Cart is empty</h2>
        <Link to="/products" className="btn-primary-block" style={{ width: 'auto', display: 'inline-flex', marginTop: '1rem' }}>
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>Checkout & Place Order</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.75rem' }}>
        <div>
          {/* 1. Shipping Address Selection */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="var(--accent-purple)" /> Shipping Address
              </h2>

              <button type="button" onClick={() => setShowAddrModal(true)} className="btn-secondary-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                <Plus size={14} /> Add New Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No addresses stored. Please add a shipping address.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {addresses.map(a => (
                  <label
                    key={a.address_id}
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      border: `1px solid ${selectedAddressId === a.address_id ? 'var(--accent-purple)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="shipping_address"
                      value={a.address_id}
                      checked={selectedAddressId === a.address_id}
                      onChange={() => setSelectedAddressId(a.address_id)}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{a.street}</strong>
                        {a.apartment_no && <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>({a.apartment_no})</span>}
                        {a.is_default && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>DEFAULT</span>}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {a.city}, {a.state} - {a.pincode}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 2. Payment Method Selector */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} color="var(--accent-purple)" /> Payment Method
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['Credit/Debit Card', 'UPI', 'Cash on Delivery', 'Net Banking'].map(mode => (
                <label
                  key={mode}
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    border: `1px solid ${paymentMode === mode ? 'var(--accent-purple)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: 600
                  }}
                >
                  <input
                    type="radio"
                    name="payment_mode"
                    value={mode}
                    checked={paymentMode === mode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  />
                  {mode}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Order Summary & Submit Sidebar */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Order Details</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem', maxHeight: '200px', overflowY: 'auto' }}>
            {items.map(item => (
              <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.product?.product_name} (x{item.quantity})</span>
                <strong style={{ color: 'var(--text-primary)' }}>${parseFloat(item.subtotal).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <hr style={{ border: 0, height: '1px', background: 'var(--border-color)', margin: '1rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>Total Payable:</span>
            <strong style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-purple)' }}>${grandTotal.toFixed(2)}</strong>
          </div>

          <button onClick={handlePlaceOrder} className="btn-primary-block" style={{ padding: '0.85rem' }} disabled={submitting}>
            <ShieldCheck size={18} /> {submitting ? 'Creating Order...' : 'Confirm & Place Order'}
          </button>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddrModal && (
        <div className="modal-overlay" onClick={() => setShowAddrModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Add Shipping Address</h3>
            <form onSubmit={handleCreateAddress}>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 124 Innovation Way"
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
                  placeholder="e.g. Apt 4B"
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
                <button type="button" onClick={() => setShowAddrModal(false)} className="btn-secondary-outline" style={{ width: 'auto' }}>
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
