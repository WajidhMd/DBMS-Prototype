import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  MapPin,
  Star,
  User,
  ShoppingBag,
  FileText,
  Calendar,
  RotateCcw,
  Truck,
  MessageSquare
} from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';
import VisualTracker from '../components/VisualTracker';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { targetDb } = useDb();

  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [targetDb]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, returnsRes, cartRes, reviewsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/returns').catch(() => ({ data: [] })),
        api.get('/cart').catch(() => ({ data: null })),
        api.get('/reviews/my').catch(() => ({ data: [] }))
      ]);
      setOrders(ordersRes.data || []);
      setReturns(returnsRes.data || []);
      setCart(cartRes.data || null);
      setReviews(reviewsRes.data || []);
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

  const activeReturnsCount = returns.filter(r =>
    !['RETURN_COMPLETED', 'RETURN_REJECTED', 'RETURN_CANCELLED'].includes(r.return_status)
  ).length;

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
            Phone: {profile?.phone || 'N/A'} • Age: <strong style={{ color: 'var(--accent-purple)' }}>{profile?.age ?? 'N/A'} years</strong> (DOB: {profile?.date_of_birth || 'N/A'})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn-primary-block" style={{ padding: '0.65rem 1.25rem', marginTop: 0, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Truck size={17} /> Track Orders & Returns
          </Link>
          <Link to="/products" className="btn-secondary-outline" style={{ padding: '0.65rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShoppingBag size={17} /> Catalog
          </Link>
          <Link to="/cart" className="btn-secondary-outline" style={{ padding: '0.65rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShoppingCart size={17} /> Cart ({cartItemsCount})
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {/* Total Orders */}
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
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalOrders}</div>
          </div>
        </div>

        {/* In-Progress Delivery */}
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
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{activeOrdersCount}</div>
          </div>
        </div>

        {/* Active Returns */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
            <RotateCcw size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Returns</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{activeReturnsCount}</div>
          </div>
        </div>

        {/* Customer Feedback count */}
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
            <MessageSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>My Reviews</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{reviews.length}</div>
          </div>
        </div>
      </div>

      {/* Active Return Shipments Alert Banner if any */}
      {returns.length > 0 && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={20} color="#ec4899" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Product Return Status</h2>
            </div>
            <Link to="/orders" style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
              Manage Returns & Tracking →
            </Link>
          </div>

          {returns.slice(0, 2).map(r => (
            <div key={r.return_id} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                <span><strong>Return {r.return_id}</strong> for Order #{r.order_number}</span>
                <span className="badge badge-success" style={{ backgroundColor: '#8b5cf6' }}>{r.return_status}</span>
              </div>
              <VisualTracker
                type="return"
                status={r.return_status}
                history={r.status_history || []}
                courierName={r.courier_name}
                trackingNumber={r.tracking_number}
                returnId={r.return_id}
                orderNumber={r.order_number}
              />
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Recent Orders</h2>
          <Link to="/orders" style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 600 }}>View All Orders & Live Tracking →</Link>
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
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(ord => (
                  <tr key={ord.order_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{ord.order_number}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{ord.order_date}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>₹{parseFloat(ord.order_amount).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge ${ord.order_status === 'DELIVERED' || ord.order_status === 'SHIPPED' ? 'badge-success' : 'badge-warning'}`}>
                        {getStatusLabel(ord.order_status)}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                      {ord.approx_delivery_date || 'Standard Delivery'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link
                          to="/orders"
                          className="btn-secondary-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Truck size={13} /> Track
                        </Link>
                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="btn-secondary-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <FileText size={13} /> PDF
                        </button>
                      </div>
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
