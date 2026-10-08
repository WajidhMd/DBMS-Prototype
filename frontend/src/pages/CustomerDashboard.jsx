import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import { Package, ShoppingCart, Clock, CheckCircle, MapPin, Star, User, ShoppingBag, FileText, Calendar } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { targetDb } = useDb();

  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [targetDb]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, cartRes] = await Promise.all([
        api.get('/orders'),
        api.get('/cart')
      ]);
      setOrders(ordersRes.data || []);
      setCart(cartRes.data || null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = orders.length;
  const cartItemsCount = cart?.items_total || 0;
  const activeOrdersCount = orders.filter(o => {
    const s = (o.order_status || '').toUpperCase();
    return s !== 'DELIVERED';
  }).length;
  const completedOrdersCount = orders.filter(o => {
    const s = (o.order_status || '').toUpperCase();
    return s === 'DELIVERED';
  }).length;

  const profile = user?.profile;

  const getStatusLabel = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'ORDER_PLACED' || s === 'PENDING_EMPLOYEE') return 'Order Placed';
    if (s === 'SENT_TO_SELLER') return 'Forwarded to Seller';
    if (s === 'ORDER_CONFIRMED') return 'Order Confirmed';
    if (s === 'SHIPPED') return 'Order Shipped';
    if (s === 'DELIVERED') return 'Delivered';
    return status;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className={`badge badge-${targetDb}`}>{targetDb.toUpperCase()} ENGINE ACTIVE</span>
            <span className="badge badge-success">CUSTOMER ACCOUNT</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome back, {profile?.first_name || user?.email}!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Phone: {profile?.phone || 'N/A'} • Age: <strong style={{ color: 'var(--accent-purple)' }}>{profile?.age ?? 'N/A'} years</strong> (derived from DOB: {profile?.date_of_birth || 'N/A'})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/products" className="btn-primary-block" style={{ padding: '0.65rem 1.25rem', marginTop: 0 }}>
            <ShoppingBag size={18} /> Browse Catalog
          </Link>
          <Link to="/cart" className="btn-secondary-outline" style={{ padding: '0.65rem 1.25rem' }}>
            <ShoppingCart size={18} /> View Cart ({cartItemsCount})
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Orders</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalOrders}</div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cart Items</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{cartItemsCount}</div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>In-Progress Orders</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{activeOrdersCount}</div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Delivered Orders</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{completedOrdersCount}</div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Recent Orders</h2>
          <Link to="/orders" style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 600 }}>View All Orders →</Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading recent orders...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
            <Package size={40} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.95rem' }}>No orders placed yet.</p>
            <Link to="/products" className="btn-primary-block" style={{ width: 'auto', display: 'inline-flex', marginTop: '1rem', padding: '0.5rem 1.25rem' }}>
              Explore Products Now
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Order Number</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Total Amount</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Est. Delivery</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(ord => (
                  <tr key={ord.order_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{ord.order_number}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{ord.order_date}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>${parseFloat(ord.order_amount).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge ${ord.order_status === 'DELIVERED' || ord.order_status === 'SHIPPED' ? 'badge-success' : 'badge-warning'}`}>
                        {getStatusLabel(ord.order_status)}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                      {ord.approx_delivery_date || 'Standard Delivery'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="btn-secondary-outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <FileText size={14} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
