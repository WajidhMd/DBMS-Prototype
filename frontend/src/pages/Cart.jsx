import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  LogIn,
  Info,
  Bookmark,
  Tag,
  CheckCircle,
  AlertCircle,
  Heart
} from 'lucide-react';

export default function Cart() {
  const { user } = useAuth();
  const { targetDb } = useDb();
  const { cart, loading, updateQuantity, removeFromCart, clearCart, addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  // Save for Later State (persisted in localStorage)
  const [savedForLater, setSavedForLater] = useState([]);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });
  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse((localStorage.getItem('pacific_saved_for_later') || localStorage.getItem('pacific_saved_for_later')) || '[]');
      setSavedForLater(stored);
    } catch (_) {}

    // Load active promo codes with single-use status
    api.get('/coupons/active')
      .then(res => {
        if (Array.isArray(res.data)) setAvailableCoupons(res.data);
      })
      .catch(() => {});

    // Load any previously applied coupon
    try {
      const storedCoupon = JSON.parse((sessionStorage.getItem('pacific_applied_coupon') || sessionStorage.getItem('pacific_applied_coupon')) || 'null');
      if (storedCoupon) setAppliedCoupon(storedCoupon);
    } catch (_) {}
  }, []);

  const handleUpdateQty = async (productId, currentQty, delta) => {
    await updateQuantity(productId, currentQty, delta);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from your cart?')) return;
    await clearCart();
    setAppliedCoupon(null);
    sessionStorage.removeItem('pacific_applied_coupon');
  };

  // Move item from active cart to Wishlist
  const handleMoveToWishlist = async (item) => {
    const productData = item.product || {
      product_id: item.product_id,
      product_name: item.product?.product_name || 'Product',
      brand: item.product?.brand || 'Brand',
      mrp: item.unit_price,
      image_url: item.product?.image_url || '',
      stock_qty: item.product?.stock_qty || 10
    };
    await addToWishlist(productData);
    await removeFromCart(item.product_id);
  };

  // Move item from active cart to Saved for Later
  const handleSaveForLater = async (item) => {
    const itemToSave = {
      product_id: item.product_id,
      product_name: item.product?.product_name || 'Product',
      brand: item.product?.brand || 'Brand',
      mrp: item.unit_price,
      image_url: item.product?.image_url || '',
      quantity: item.quantity
    };

    const updated = [itemToSave, ...savedForLater.filter(s => s.product_id !== item.product_id)];
    setSavedForLater(updated);
    localStorage.setItem('pacific_saved_for_later', JSON.stringify(updated));

    await removeFromCart(item.product_id);
  };

  // Move saved item back to active cart
  const handleMoveToCart = async (savedItem) => {
    await addToCart({
      product_id: savedItem.product_id,
      product_name: savedItem.product_name,
      mrp: savedItem.mrp,
      image_url: savedItem.image_url,
      stock_qty: 10
    }, savedItem.quantity || 1);

    const updated = savedForLater.filter(s => s.product_id !== savedItem.product_id);
    setSavedForLater(updated);
    localStorage.setItem('pacific_saved_for_later', JSON.stringify(updated));
  };

  const handleRemoveSaved = (productId) => {
    const updated = savedForLater.filter(s => s.product_id !== productId);
    setSavedForLater(updated);
    localStorage.setItem('pacific_saved_for_later', JSON.stringify(updated));
  };

  // Coupon Code Validation
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setCouponLoading(true);
      setCouponMsg({ text: '', type: '' });
      const res = await api.post('/cart/coupon', {
        code: couponCode.trim(),
        cartTotal: cart?.grand_total || 0
      });

      setAppliedCoupon(res.data);
      sessionStorage.setItem('pacific_applied_coupon', JSON.stringify(res.data));
      setCouponMsg({ text: `Coupon '${res.data.code}' applied successfully! Saved ₹${res.data.discountAmount}`, type: 'success' });
    } catch (err) {
      setCouponMsg({ text: err.response?.data?.error || 'Invalid coupon code.', type: 'error' });
      setAppliedCoupon(null);
      sessionStorage.removeItem('pacific_applied_coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMsg({ text: '', type: '' });
    sessionStorage.removeItem('pacific_applied_coupon');
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading your cart...</div>;
  }

  const items = cart?.items || [];
  const itemsTotal = cart?.items_total || 0;
  const rawGrandTotal = cart?.grand_total || 0;
  const discount = appliedCoupon?.discountAmount || 0;
  const finalPayable = Math.max(0, rawGrandTotal - discount);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '1050px', margin: '0 auto' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className={`badge badge-${targetDb}`}>TARGET: {targetDb.toUpperCase()}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {user ? 'Customer Cart (Database Associated)' : 'Guest Shopping Cart (Local Session)'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Shopping Cart</h1>
        </div>

        {items.length > 0 && (
          <button onClick={handleClearCart} style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
            Clear Cart
          </button>
        )}
      </div>

      {/* Guest Shopping Notice */}
      {!user && items.length > 0 && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.88rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={17} color="var(--color-primary)" />
            <span>
              You are shopping as a <strong>Guest</strong>. You can review and adjust quantities here, and will sign in or register when proceeding to checkout.
            </span>
          </div>
          <Link
            to="/login?redirect=/checkout"
            style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <LogIn size={14} /> Sign In Now
          </Link>
        </div>
      )}

      {items.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '4rem 1rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <ShoppingCart size={50} style={{ opacity: 0.4, marginBottom: '1rem', color: 'var(--color-primary)' }} />
          <h2>Your Cart is Currently Empty</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem' }}>
            Explore our luxury catalog and add products to your cart.
          </p>
          <Link to="/products" className="btn-primary-block" style={{ width: 'auto', display: 'inline-flex', padding: '0.65rem 1.5rem' }}>
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {/* Cart Table */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Product</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Price</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Quantity</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Subtotal</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.product_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {item.product?.product_name || 'Product'}
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Brand: {item.product?.brand}</span>
                        {item.attributes && (
                          <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {item.attributes.color && (
                              <span style={{ fontSize: '0.72rem', background: 'rgba(198, 161, 91, 0.15)', border: '1px solid rgba(198, 161, 91, 0.3)', color: 'var(--color-primary)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                                Color: {item.attributes.color}
                              </span>
                            )}
                            {item.attributes.variant && (
                              <span style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                                Option: {item.attributes.variant}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                        ₹{parseFloat(item.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                          <button
                            onClick={() => handleUpdateQty(item.product_id, item.quantity, -1)}
                            style={{ padding: '0.25rem 0.5rem', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ padding: '0 0.5rem', fontWeight: 700, fontSize: '0.88rem' }}>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQty(item.product_id, item.quantity, 1)}
                            style={{ padding: '0.25rem 0.5rem', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        ₹{parseFloat(item.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.65rem', alignItems: 'center' }}>
                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                            title="Move to Wishlist"
                          >
                            <Heart size={14} color="var(--color-primary)" /> Wishlist
                          </button>
                          <button
                            onClick={() => handleSaveForLater(item)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                            title="Save for Later"
                          >
                            <Bookmark size={14} color="var(--color-primary)" /> Save
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.product_id)}
                            style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}
                            title="Remove Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cart Summary Sidebar & Coupon Box */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h3>

            {/* Promo Coupon Form */}
            <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem', color: 'var(--color-primary)' }}>
                <Tag size={14} /> Apply Promo Code
              </label>

              {appliedCoupon ? (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#22c55e', fontSize: '0.85rem' }}>
                      {appliedCoupon.code} Applied
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {appliedCoupon.description}
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. JMART20 or GOLD500"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '0.4rem 0.65rem',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    style={{
                      background: 'var(--color-primary)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.4rem 0.85rem',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {!appliedCoupon && (
                <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>Active Promos:</span>
                  {(availableCoupons.length > 0 ? availableCoupons : [
                    { code: 'PACIFIC20', discount_value: 20, discount_type: 'percentage' },
                    { code: 'GOLD500', discount_value: 500, discount_type: 'flat' },
                    { code: 'WELCOME10', discount_value: 10, discount_type: 'percentage' },
                    { code: 'FREESHIP', discount_value: 99, discount_type: 'flat' }
                  ]).map(promo => {
                    const isUsed = Boolean(promo.already_used);
                    return (
                      <button
                        key={promo.code}
                        type="button"
                        onClick={() => {
                          if (isUsed) {
                            setCouponMsg({
                              text: `Coupon '${promo.code}' has already been redeemed by your account. Single-use only!`,
                              type: 'error'
                            });
                          } else {
                            setCouponCode(promo.code);
                          }
                        }}
                        style={{
                          background: isUsed ? 'rgba(239, 68, 68, 0.08)' : 'rgba(212, 175, 55, 0.1)',
                          border: isUsed ? '1px dashed rgba(239, 68, 68, 0.35)' : '1px dashed rgba(212, 175, 55, 0.4)',
                          color: isUsed ? '#f87171' : 'var(--color-primary)',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          cursor: isUsed ? 'not-allowed' : 'pointer',
                          textDecoration: isUsed ? 'line-through' : 'none',
                          opacity: isUsed ? 0.65 : 1
                        }}
                        title={isUsed ? 'Already redeemed on a previous order' : (promo.description || promo.code)}
                      >
                        {promo.code} {isUsed ? '(Used)' : (promo.discount_value ? (promo.discount_type === 'percentage' ? `(${promo.discount_value}% OFF)` : `(₹${promo.discount_value} OFF)`) : '')}
                      </button>
                    );
                  })}
                </div>
              )}

              {couponMsg.text && (
                <div style={{
                  fontSize: '0.75rem',
                  marginTop: '0.4rem',
                  color: couponMsg.type === 'error' ? '#ef4444' : '#22c55e'
                }}>
                  {couponMsg.text}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Items Total:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{itemsTotal} items</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <strong style={{ color: 'var(--text-primary)' }}>₹{rawGrandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </div>

            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: '#22c55e' }}>
                <span>Coupon Discount ({appliedCoupon.code}):</span>
                <strong>- ₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Shipping & Handling:</span>
              <span className="badge badge-success">FREE</span>
            </div>

            <hr style={{ border: 0, height: '1px', background: 'var(--border-color)', margin: '1rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>Total Payable:</span>
              <strong style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                ₹{finalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </strong>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="btn-primary-block"
              style={{
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                marginTop: 0
              }}
            >
              {user ? (
                <>
                  Proceed to Checkout <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <LogIn size={16} /> Proceed to Checkout (Sign In)
                </>
              )}
            </button>

            <Link to="/products" className="btn-secondary-outline" style={{ marginTop: '0.75rem' }}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Save for Later Section */}
      {savedForLater.length > 0 && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Bookmark size={18} color="var(--color-primary)" /> Saved for Later ({savedForLater.length} items)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {savedForLater.map(item => (
              <div
                key={item.product_id}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  gap: '0.85rem'
                }}
              >
                {item.image_url && (
                  <img src={item.image_url} alt={item.product_name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', background: '#111' }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.product_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.brand}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.3rem 0' }}>
                    ₹{parseFloat(item.mrp).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleMoveToCart(item)}
                      style={{
                        background: 'var(--color-primary)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveSaved(item.product_id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        color: '#f87171',
                        borderRadius: '4px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
