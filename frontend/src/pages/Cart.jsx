import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { user } = useAuth();
  const { targetDb } = useDb();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, [targetDb]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data || null);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQty = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    try {
      const res = await api.put(`/cart/${productId}`, { quantity: newQty });
      setCart(res.data);
    } catch (err) {
      alert('Failed to update item quantity.');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      setCart(res.data);
    } catch (err) {
      alert('Failed to remove item from cart.');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from your cart?')) return;
    try {
      const res = await api.delete('/cart/clear');
      setCart(res.data);
    } catch (err) {
      alert('Failed to clear cart.');
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading your cart...</div>;
  }

  const items = cart?.items || [];
  const itemsTotal = cart?.items_total || 0;
  const grandTotal = cart?.grand_total || 0;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className={`badge badge-${targetDb}`}>TARGET: {targetDb.toUpperCase()}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>M:N Junction: cart_item</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Shopping Cart</h1>
        </div>

        {items.length > 0 && (
          <button onClick={handleClearCart} style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600 }}>
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '4rem 1rem',
          textAlign: 'center'
        }}>
          <ShoppingCart size={50} style={{ opacity: 0.4, marginBottom: '1rem' }} />
          <h2>Your Cart is Currently Empty</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem' }}>
            Explore our product catalog and add items to your cart.
          </p>
          <Link to="/products" className="btn-primary-block" style={{ width: 'auto', display: 'inline-flex', padding: '0.65rem 1.5rem' }}>
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.75rem' }}>
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
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Action</th>
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
                      </td>

                      <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                        ₹{parseFloat(item.unit_price).toFixed(2)}
                      </td>

                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                          <button
                            onClick={() => handleUpdateQty(item.product_id, item.quantity, -1)}
                            style={{ padding: '0.25rem 0.5rem', background: 'transparent', color: 'var(--text-primary)' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ padding: '0 0.5rem', fontWeight: 700, fontSize: '0.88rem' }}>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQty(item.product_id, item.quantity, 1)}
                            style={{ padding: '0.25rem 0.5rem', background: 'transparent', color: 'var(--text-primary)' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                        ₹{parseFloat(item.subtotal).toFixed(2)}
                      </td>

                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <button onClick={() => handleRemoveItem(item.product_id)} style={{ background: 'transparent', color: '#f87171' }} title="Remove Item">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cart Summary Sidebar */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Total Items (Derived):</span>
              <strong style={{ color: 'var(--text-primary)' }}>{itemsTotal} items</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Shipping & Delivery:</span>
              <span className="badge badge-success">FREE</span>
            </div>

            <hr style={{ border: 0, height: '1px', background: 'var(--border-color)', margin: '1rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>Grand Total (Derived):</span>
              <strong style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-purple)' }}>₹{grandTotal.toFixed(2)}</strong>
            </div>

            <Link to="/checkout" className="btn-primary-block" style={{ padding: '0.85rem' }}>
              Proceed to Checkout <ArrowRight size={16} />
            </Link>

            <Link to="/products" className="btn-secondary-outline" style={{ marginTop: '0.75rem' }}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
