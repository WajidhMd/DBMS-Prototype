import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import {
  Package,
  Send,
  Truck,
  CheckCircle,
  Clock,
  User,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  History,
  ShieldCheck,
  AlertCircle,
  FileText,
  Calendar
} from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { targetDb } = useDb();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // requests | sent | confirmed | shipped | delivered
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [targetDb]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load employee orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForwardToSeller = async (orderId) => {
    try {
      setActionLoading(orderId);
      await api.post(`/orders/${orderId}/forward`);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to forward order to seller.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    try {
      setActionLoading(orderId);
      await api.post(`/orders/${orderId}/mark-delivered`);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to mark order as delivered.');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter lists based on status
  const pendingRequests = orders.filter(o => {
    const s = (o.order_status || '').toUpperCase();
    return s === 'ORDER_PLACED' || s === 'PENDING_EMPLOYEE' || s === 'PENDING';
  });

  const sentToSellerOrders = orders.filter(o =>
    (o.order_status || '').toUpperCase() === 'SENT_TO_SELLER'
  );

  const confirmedOrders = orders.filter(o =>
    (o.order_status || '').toUpperCase() === 'ORDER_CONFIRMED'
  );

  const shippedOrders = orders.filter(o =>
    (o.order_status || '').toUpperCase() === 'SHIPPED'
  );

  const deliveredOrders = orders.filter(o =>
    (o.order_status || '').toUpperCase() === 'DELIVERED'
  );

  const toggleExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Employee Banner */}
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
            <span className={`badge badge-${targetDb}`}>{targetDb.toUpperCase()} ENGINE</span>
            <span className="badge badge-success">EMPLOYEE INTERMEDIARY PORTAL</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Employee Operations Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Logged in as <strong>{user?.profile?.name || user?.email}</strong> • Managing Order Lifecycle (Forwarding & Delivery)
          </p>
        </div>

        <button onClick={fetchOrders} className="btn-secondary-outline" style={{ width: 'auto', padding: '0.65rem 1.25rem' }}>
          Refresh Order Stream
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>New Order Requests</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{pendingRequests.length}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sent to Sellers</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{sentToSellerOrders.length}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Seller Confirmed</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{confirmedOrders.length}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Shipped (Pending Delivery)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{shippedOrders.length}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Delivered</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-green)' }}>{deliveredOrders.length}</div>
        </div>
      </div>

      {/* Workflow Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'requests' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'requests' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <Clock size={16} /> New Requests ({pendingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'sent' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'sent' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <Send size={16} /> Forwarded to Sellers ({sentToSellerOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('confirmed')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'confirmed' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'confirmed' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <ShieldCheck size={16} /> Seller Confirmed ({confirmedOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('shipped')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'shipped' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'shipped' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <Truck size={16} /> Order Shipped ({shippedOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('delivered')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'delivered' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'delivered' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <CheckCircle size={16} /> Delivered ({deliveredOrders.length})
        </button>
      </div>

      {/* Orders List Container */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem' }}>Loading orders...</p>
        ) : (
          <>
            {/* TAB 1: NEW ORDER REQUESTS */}
            {activeTab === 'requests' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Customer Order Requests (Awaiting Employee Forwarding)
                </h3>

                {pendingRequests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle size={40} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                    <p>No new customer order requests pending employee forwarding.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {pendingRequests.map(ord => (
                      <OrderCard
                        key={ord.order_id}
                        ord={ord}
                        expanded={expandedOrder === ord.order_id}
                        onToggle={() => toggleExpand(ord.order_id)}
                        onViewInvoice={() => setSelectedInvoiceOrder(ord)}
                        actionButton={
                          <button
                            onClick={() => handleForwardToSeller(ord.order_id)}
                            disabled={actionLoading === ord.order_id}
                            className="btn-primary-block"
                            style={{ width: 'auto', marginTop: 0, padding: '0.6rem 1.2rem' }}
                          >
                            <Send size={16} /> {actionLoading === ord.order_id ? 'Forwarding...' : 'Forward Order to Seller'}
                          </button>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: FORWARDED TO SELLERS */}
            {activeTab === 'sent' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Orders Forwarded to Sellers (Awaiting Seller Confirmation)
                </h3>

                {sentToSellerOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                    <Send size={40} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                    <p>No orders currently waiting for seller confirmation.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {sentToSellerOrders.map(ord => (
                      <OrderCard
                        key={ord.order_id}
                        ord={ord}
                        expanded={expandedOrder === ord.order_id}
                        onToggle={() => toggleExpand(ord.order_id)}
                        onViewInvoice={() => setSelectedInvoiceOrder(ord)}
                        actionBadge={
                          <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                            Forwarded to Seller (Awaiting Confirmation)
                          </span>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SELLER CONFIRMED ORDERS */}
            {activeTab === 'confirmed' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Orders Confirmed by Seller (Awaiting Seller Shipping Request)
                </h3>

                {confirmedOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                    <ShieldCheck size={40} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                    <p>No seller confirmed orders pending shipping.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {confirmedOrders.map(ord => (
                      <OrderCard
                        key={ord.order_id}
                        ord={ord}
                        expanded={expandedOrder === ord.order_id}
                        onToggle={() => toggleExpand(ord.order_id)}
                        onViewInvoice={() => setSelectedInvoiceOrder(ord)}
                        actionBadge={
                          <span className="badge badge-cyan" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                            Order Confirmed by Seller
                          </span>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SHIPPED ORDERS (EMPLOYEE MARK AS DELIVERED) */}
            {activeTab === 'shipped' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Shipped Orders (Employee Exclusive Action: Mark as Delivered)
                </h3>

                {shippedOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                    <Truck size={40} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                    <p>No orders currently in SHIPPED status.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {shippedOrders.map(ord => (
                      <OrderCard
                        key={ord.order_id}
                        ord={ord}
                        expanded={expandedOrder === ord.order_id}
                        onToggle={() => toggleExpand(ord.order_id)}
                        onViewInvoice={() => setSelectedInvoiceOrder(ord)}
                        actionButton={
                          <button
                            onClick={() => handleMarkAsDelivered(ord.order_id)}
                            disabled={actionLoading === ord.order_id}
                            style={{
                              backgroundColor: '#10b981',
                              color: '#fff',
                              padding: '0.6rem 1.2rem',
                              borderRadius: 'var(--radius-md)',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <CheckCircle size={16} /> {actionLoading === ord.order_id ? 'Updating...' : 'Mark as Delivered (Employee Only)'}
                          </button>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: DELIVERED ORDERS */}
            {activeTab === 'delivered' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Delivered & Completed Orders History
                </h3>

                {deliveredOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                    <Package size={40} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                    <p>No delivered orders recorded yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {deliveredOrders.map(ord => (
                      <OrderCard
                        key={ord.order_id}
                        ord={ord}
                        expanded={expandedOrder === ord.order_id}
                        onToggle={() => toggleExpand(ord.order_id)}
                        onViewInvoice={() => setSelectedInvoiceOrder(ord)}
                        actionBadge={
                          <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', backgroundColor: '#10b981', color: '#fff' }}>
                            DELIVERED
                          </span>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
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

function OrderCard({ ord, expanded, onToggle, onViewInvoice, actionButton, actionBadge }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem',
      transition: 'border-color 0.2s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <strong style={{ fontSize: '1.1rem', color: 'var(--accent-purple)' }}>{ord.order_number}</strong>
            <span className="badge badge-mysql">
              {ord.order_status === 'ORDER_PLACED' ? 'Order Placed' :
               ord.order_status === 'SENT_TO_SELLER' ? 'Forwarded to Seller' :
               ord.order_status === 'ORDER_CONFIRMED' ? 'Confirmed by Seller' :
               ord.order_status === 'SHIPPED' ? 'Order Shipped' :
               ord.order_status === 'DELIVERED' ? 'Delivered' : ord.order_status}
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span>Customer: <strong>{ord.customer_name} ({ord.customer_email})</strong></span>
            <span>Date: <strong>{ord.order_date}</strong></span>
            <span>Total Price: <strong style={{ color: 'var(--text-primary)' }}>${parseFloat(ord.order_amount).toFixed(2)}</strong></span>
            {ord.approx_delivery_date && (
              <span style={{ color: 'var(--accent-green)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <Calendar size={14} /> Approx Delivery: {ord.approx_delivery_date}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onViewInvoice}
            className="btn-primary-block"
            style={{
              width: 'auto',
              marginTop: 0,
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--accent-purple)'
            }}
          >
            <FileText size={15} /> Invoice
          </button>

          {actionButton}
          {actionBadge}

          <button onClick={onToggle} className="btn-secondary-outline" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expanded ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>

      {/* Expanded Order & Products Details */}
      {expanded && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }} className="animate-fade-in">
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Ordered Products & Quantities</h4>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.5rem' }}>Product Name</th>
                  <th style={{ padding: '0.5rem' }}>Brand</th>
                  <th style={{ padding: '0.5rem' }}>Unit Price ($)</th>
                  <th style={{ padding: '0.5rem' }}>Quantity</th>
                  <th style={{ padding: '0.5rem' }}>Subtotal ($)</th>
                </tr>
              </thead>
              <tbody>
                {ord.items?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 600 }}>{item.product_name}</td>
                    <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{item.brand}</td>
                    <td style={{ padding: '0.5rem' }}>${parseFloat(item.unit_price).toFixed(2)}</td>
                    <td style={{ padding: '0.5rem' }}>{item.quantity}</td>
                    <td style={{ padding: '0.5rem', fontWeight: 700 }}>${(parseFloat(item.unit_price) * parseInt(item.quantity)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {/* Shipping Address */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Shipping Information:</strong>
              <p style={{ color: 'var(--text-secondary)' }}>
                {ord.address ? `${ord.address.street}, ${ord.address.apartment_no ? ord.address.apartment_no + ', ' : ''}${ord.address.city}, ${ord.address.state} - ${ord.address.pincode}` : 'Standard Address'}
              </p>
            </div>

            {/* Payment Details */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
              <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Payment Status & Delivery Info:</strong>
              <p style={{ color: 'var(--text-secondary)' }}>
                Method: <strong>{ord.payment?.payment_mode || 'Credit/Debit Card'}</strong> • Status: <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{ord.payment?.payment_status || 'Completed'}</span>
              </p>
              {ord.approx_delivery_date && (
                <div style={{ marginTop: '0.4rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                  Approximate Delivery Date: <strong>{ord.approx_delivery_date}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Audit History Timeline */}
          {ord.history && ord.history.length > 0 && (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                <History size={16} /> Order Audit Trail & Activity Log
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                {ord.history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.25rem' }}>
                    <span><strong>{h.action}</strong> ({h.performed_by})</span>
                    <span style={{ color: 'var(--text-muted)' }}>{h.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
