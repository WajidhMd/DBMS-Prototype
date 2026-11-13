import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import {
  MapPin,
  CreditCard,
  ShieldCheck,
  Plus,
  CheckCircle,
  ArrowLeft,
  FileText,
  ShoppingBag,
  Truck,
  Gift,
  Zap,
  Tag
} from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';
import RazorpayModal from '../components/RazorpayModal';

const DELIVERY_TIERS = [
  { id: 'standard', name: 'Standard Delivery', time: '3-5 Business Days', fee: 0, tag: 'FREE' },
  { id: 'next_day', name: 'Next-Day Express', time: 'Guaranteed Tomorrow by 8 PM', fee: 49, tag: '₹49' },
  { id: 'same_day', name: 'VIP Same-Day Rush', time: 'Delivered Today by 9 PM', fee: 99, tag: '₹99' }
];

export default function Checkout() {
  const { user } = useAuth();
  const { targetDb } = useDb();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMode, setPaymentMode] = useState('Razorpay (Test Mode)');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // Delivery & Gifting Options
  const [deliveryTier, setDeliveryTier] = useState('standard');
  const [isGift, setIsGift] = useState(false);
  const [addGiftWrap, setAddGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Applied Coupon from session
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [checkoutCouponCode, setCheckoutCouponCode] = useState('');
  const [checkoutCouponLoading, setCheckoutCouponLoading] = useState(false);
  const [checkoutCouponMsg, setCheckoutCouponMsg] = useState({ text: '', type: '' });

  const handleApplyCheckoutCoupon = async (e) => {
    e?.preventDefault();
    if (!checkoutCouponCode.trim()) return;
    try {
      setCheckoutCouponLoading(true);
      setCheckoutCouponMsg({ text: '', type: '' });
      const res = await api.post('/cart/coupon', {
        code: checkoutCouponCode.trim(),
        cartTotal: cart?.grand_total || 0
      });
      setAppliedCoupon(res.data);
      sessionStorage.setItem('pacific_applied_coupon', JSON.stringify(res.data));
      setCheckoutCouponMsg({ text: `Coupon '${res.data.code}' applied! Saved ₹${res.data.discountAmount}`, type: 'success' });
    } catch (err) {
      setCheckoutCouponMsg({ text: err.response?.data?.error || 'Invalid coupon.', type: 'error' });
    } finally {
      setCheckoutCouponLoading(false);
    }
  };

  const handleRemoveCheckoutCoupon = () => {
    setAppliedCoupon(null);
    setCheckoutCouponCode('');
    setCheckoutCouponMsg({ text: '', type: '' });
    sessionStorage.removeItem('pacific_applied_coupon');
  };

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
    try {
      const storedCoupon = JSON.parse((sessionStorage.getItem('pacific_applied_coupon') || sessionStorage.getItem('pacific_applied_coupon')) || 'null');
      if (storedCoupon) setAppliedCoupon(storedCoupon);
    } catch (_) {}
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
    e?.preventDefault();
    setError('');

    if (!selectedAddressId) {
      setError('Please select or add a shipping address.');
      return;
    }

    if (paymentMode.includes('Razorpay')) {
      setShowRazorpayModal(true);
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/orders', {
        address_id: selectedAddressId,
        payment_mode: paymentMode,
        delivery_tier: deliveryTier,
        delivery_fee: deliveryFee,
        is_gift: isGift,
        gift_wrap: addGiftWrap,
        gift_message: giftMessage,
        coupon_code: appliedCoupon?.code || null,
        discount_amount: appliedCoupon?.discountAmount || 0
      });

      // Clear applied coupon from storage upon order placement
      sessionStorage.removeItem('pacific_applied_coupon');
      setCreatedOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRazorpaySuccess = async (rzpData) => {
    try {
      setSubmitting(true);
      setShowRazorpayModal(false);

      const res = await api.post('/orders', {
        address_id: selectedAddressId,
        payment_mode: `Razorpay (${rzpData.payment_method || 'Test Mode'})`,
        delivery_tier: deliveryTier,
        delivery_fee: deliveryFee,
        is_gift: isGift,
        gift_wrap: addGiftWrap,
        gift_message: giftMessage,
        coupon_code: appliedCoupon?.code || null,
        discount_amount: appliedCoupon?.discountAmount || 0,
        razorpay_payment_id: rzpData.razorpay_payment_id,
        razorpay_order_id: rzpData.razorpay_order_id
      });

      sessionStorage.removeItem('pacific_applied_coupon');
      setCreatedOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete order after Razorpay verification.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Preparing checkout...</div>;
  }

  // Order Success Screen
  if (createdOrder) {
    return (
      <div className="animate-fade-in" style={{ padding: '3rem 1rem', maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 2rem',
          boxShadow: '0 12px 36px rgba(0,0,0,0.3)'
        }}>
          <CheckCircle size={56} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Placed Successfully!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Thank you for shopping with PACIFIC! Your order ID is <strong style={{ color: 'var(--text-primary)' }}>#{createdOrder.order_id}</strong>.
          </p>

          <div style={{
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <span className="badge badge-warning">{createdOrder.order_status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Target DBMS:</span>
              <span className={`badge badge-${targetDb}`}>{targetDb.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Delivery Speed:</span>
              <strong style={{ color: 'var(--color-primary)' }}>
                {DELIVERY_TIERS.find(t => t.id === deliveryTier)?.name}
              </strong>
            </div>
            {isGift && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Gifting Option:</span>
                <span style={{ color: 'var(--color-primary)' }}>Luxury Gift Wrap & Message Included</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Amount:</span>
              <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                ₹{parseFloat(createdOrder.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="btn-primary-block"
              style={{ width: 'auto', padding: '0.65rem 1.25rem', marginTop: 0, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <FileText size={16} /> Download Tax Invoice
            </button>
            <Link
              to="/orders"
              className="btn-secondary-outline"
              style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Truck size={16} /> Track Order in PACIFIC
            </Link>
          </div>
        </div>

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
  const rawGrandTotal = cart?.grand_total || 0;
  const deliveryFee = DELIVERY_TIERS.find(t => t.id === deliveryTier)?.fee || 0;
  const giftFee = (isGift && addGiftWrap) ? 49 : 0;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const finalPayable = Math.max(0, rawGrandTotal + deliveryFee + giftFee - couponDiscount);

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
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '1050px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>Checkout & Place Order</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.75rem' }}>
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
                <MapPin size={20} color="var(--color-primary)" /> Shipping Address
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
                      border: `1px solid ${selectedAddressId === a.address_id ? 'var(--color-primary)' : 'var(--border-color)'}`,
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
                      style={{ marginTop: '0.2rem', accentColor: 'var(--color-primary)' }}
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

          {/* 2. Tiered Delivery Speeds */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} color="var(--color-primary)" /> Choose Delivery Speed
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {DELIVERY_TIERS.map(tier => (
                <label
                  key={tier.id}
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    border: `1px solid ${deliveryTier === tier.id ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <input
                      type="radio"
                      name="delivery_tier"
                      value={tier.id}
                      checked={deliveryTier === tier.id}
                      onChange={() => setDeliveryTier(tier.id)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{tier.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{tier.time}</div>
                    </div>
                  </div>
                  <span className={`badge ${tier.fee === 0 ? 'badge-success' : 'badge-warning'}`} style={{ fontWeight: 700 }}>
                    {tier.tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Gifting Options */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Gift size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Gifting Options</h2>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span>This order contains a gift for a loved one</span>
            </label>

            {isGift && (
              <div style={{ paddingLeft: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={addGiftWrap}
                    onChange={(e) => setAddGiftWrap(e.target.checked)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>Add Luxury Black & Gold Gift Packaging & Satin Ribbon (+₹49)</span>
                </label>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                    Personalized Gift Message:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Wishing you a wonderful celebration! Warm regards."
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      color: 'var(--text-primary)',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. Payment Method Selector */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} color="var(--color-primary)" /> Payment Method
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              {[
                { id: 'Razorpay (Test Mode)', name: 'Razorpay Instant Pay (Test Mode)', desc: 'Fast checkout via UPI QR, Google Pay, PhonePe, Cards, NetBanking', badge: 'RECOMMENDED', badgeColor: '#0c66e4' },
                { id: 'Cash on Delivery', name: 'Cash on Delivery (COD)', desc: 'Pay with cash upon doorstep delivery', badge: 'AVAILABLE', badgeColor: '#16a34a' },
                { id: 'Credit/Debit Card', name: 'Standard Credit / Debit Card', desc: 'Direct merchant card processing', badge: null },
                { id: 'UPI Direct', name: 'UPI Direct Transfer', desc: 'Direct VPA transfer', badge: null }
              ].map(mode => (
                <label
                  key={mode.id}
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    border: `1px solid ${paymentMode === mode.id ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.88rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <input
                      type="radio"
                      name="payment_mode"
                      value={mode.id}
                      checked={paymentMode === mode.id}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{mode.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{mode.desc}</div>
                    </div>
                  </div>
                  {mode.badge && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px', background: mode.badgeColor, color: '#fff' }}>
                      {mode.badge}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Order Summary Sidebar */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Order Details</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem', maxHeight: '180px', overflowY: 'auto' }}>
            {items.map(item => (
              <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.product?.product_name || 'Product'} (x{item.quantity})</span>
                  {item.attributes && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', marginTop: '0.15rem' }}>
                      {item.attributes.color ? `Color: ${item.attributes.color}` : ''}
                      {item.attributes.color && item.attributes.variant ? ' • ' : ''}
                      {item.attributes.variant ? item.attributes.variant : ''}
                    </div>
                  )}
                </div>
                <strong style={{ color: 'var(--text-primary)' }}>₹{parseFloat(item.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
            ))}
          </div>

          <hr style={{ border: 0, height: '1px', background: 'var(--border-color)', margin: '1rem 0' }} />

          {/* Coupon Code Input in Checkout */}
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
              <Tag size={13} /> Promo Code / Voucher
            </label>
            {appliedCoupon ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>{appliedCoupon.code} (-₹{appliedCoupon.discountAmount})</span>
                <button type="button" onClick={handleRemoveCheckoutCoupon} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <input
                  type="text"
                  placeholder="e.g. PACIFIC20 or GOLD500"
                  value={checkoutCouponCode}
                  onChange={(e) => setCheckoutCouponCode(e.target.value.toUpperCase())}
                  style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.35rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', textTransform: 'uppercase' }}
                />
                <button
                  type="button"
                  onClick={handleApplyCheckoutCoupon}
                  disabled={checkoutCouponLoading || !checkoutCouponCode.trim()}
                  style={{ background: 'var(--color-primary)', color: '#000', border: 'none', borderRadius: '4px', padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {checkoutCouponLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}
            {!appliedCoupon && (
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>Try:</span>
                {[
                  { code: 'PACIFIC20', label: 'PACIFIC20 (20% OFF)' },
                  { code: 'GOLD500', label: 'GOLD500 (₹500 OFF)' },
                  { code: 'WELCOME10', label: 'WELCOME10 (10% OFF)' },
                  { code: 'FREESHIP', label: 'FREESHIP' }
                ].map(p => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => {
                      setCheckoutCouponCode(p.code);
                    }}
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px dashed rgba(212, 175, 55, 0.4)',
                      color: 'var(--color-primary)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
            {checkoutCouponMsg.text && (
              <div style={{ fontSize: '0.72rem', marginTop: '0.35rem', color: checkoutCouponMsg.type === 'error' ? '#f87171' : '#22c55e' }}>
                {checkoutCouponMsg.text}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items Subtotal:</span>
              <strong style={{ color: 'var(--text-primary)' }}>₹{rawGrandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </div>

            {couponDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22c55e' }}>
                <span>Coupon ({appliedCoupon.code}):</span>
                <strong>- ₹{couponDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery Speed:</span>
              <strong style={{ color: deliveryFee === 0 ? '#22c55e' : 'var(--text-primary)' }}>
                {deliveryFee === 0 ? 'FREE' : `+ ₹${deliveryFee}`}
              </strong>
            </div>

            {giftFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Luxury Gift Wrap:</span>
                <strong style={{ color: 'var(--text-primary)' }}>+ ₹{giftFee}</strong>
              </div>
            )}
          </div>

          <hr style={{ border: 0, height: '1px', background: 'var(--border-color)', margin: '1rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>Total Payable:</span>
            <strong style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              ₹{finalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </strong>
          </div>

          <button onClick={handlePlaceOrder} className="btn-primary-block" style={{ padding: '0.85rem' }} disabled={submitting}>
            <ShieldCheck size={18} /> {submitting ? 'Creating Order...' : (paymentMode.includes('Razorpay') ? `Pay ₹${finalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })} via Razorpay` : 'Confirm & Place Order')}
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
      {/* Razorpay Test-Mode Payment Gateway Modal */}
      {showRazorpayModal && (
        <RazorpayModal
          isOpen={showRazorpayModal}
          onClose={() => setShowRazorpayModal(false)}
          amount={finalPayable}
          customerEmail={user?.email}
          onSuccess={handleRazorpaySuccess}
        />
      )}
    </div>
  );
}
