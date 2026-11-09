import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import {
  Package,
  Clock,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Truck,
  RotateCcw,
  Star,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  XCircle,
  X,
  ShieldCheck
} from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';
import VisualTracker from '../components/VisualTracker';
import ReturnModal from '../components/ReturnModal';
import ShipReturnModal from '../components/ShipReturnModal';
import ReviewModal from '../components/ReviewModal';

export default function Orders() {
  const { user, role } = useAuth();
  const { targetDb } = useDb();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'returns'
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Modals state
  const [returnOrder, setReturnOrder] = useState(null);
  const [shippingReturnReq, setShippingReturnReq] = useState(null);
  const [reviewItem, setReviewItem] = useState(null);

  // 3PL Tracking Modal State
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Order Cancellation State
  const [cancelOrderObj, setCancelOrderObj] = useState(null);
  const [cancelReason, setCancelReason] = useState('Order placed by mistake');
  const [cancelling, setCancelling] = useState(false);

  // Order Exchange State
  const [exchangeOrderObj, setExchangeOrderObj] = useState(null);
  const [selectedExchangeItem, setSelectedExchangeItem] = useState(null);
  const [exchangeReason, setExchangeReason] = useState('Size / fit too small');
  const [replacementVariant, setReplacementVariant] = useState('Next larger size / standard color');
  const [exchanging, setExchanging] = useState(false);

  const handleOpenTracking = async (ord) => {
    try {
      setTrackingOrder(ord);
      setTrackingLoading(true);
      const res = await api.get(`/logistics/tracking/${ord.order_id}`);
      setTrackingData(res.data);
    } catch (err) {
      alert('Failed to load tracking data.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelOrderObj) return;
    try {
      setCancelling(true);
      const res = await api.post(`/orders/${cancelOrderObj.order_id}/cancel`, {
        reason: cancelReason
      });
      alert(res.data?.message || 'Order cancelled successfully.');
      setCancelOrderObj(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const handleConfirmExchange = async () => {
    if (!exchangeOrderObj) return;
    try {
      setExchanging(true);
      const res = await api.post(`/orders/${exchangeOrderObj.order_id}/exchange`, {
        itemId: selectedExchangeItem?.item_id || 'item-1',
        reason: exchangeReason,
        replacementVariant
      });
      alert(res.data?.message || 'Exchange request approved!');
      setExchangeOrderObj(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to request exchange.');
    } finally {
      setExchanging(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [targetDb]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, returnsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/returns')
      ]);
      setOrders(ordersRes.data || []);
      setReturns(returnsRes.data || []);
    } catch (err) {
      console.error('Failed to load orders/returns:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status) => {
    const upper = (status || '').toUpperCase();
    if (upper === 'ORDER_PLACED' || upper === 'PENDING_EMPLOYEE' || upper === 'PENDING') {
      return <span className="badge badge-warning">Order Placed</span>;
    }
    if (upper === 'SENT_TO_SELLER') {
      return <span className="badge badge-cyan" style={{ backgroundColor: '#0284c7', color: '#fff' }}>Forwarded to Seller</span>;
    }
    if (upper === 'ORDER_CONFIRMED') {
      return <span className="badge badge-cyan" style={{ backgroundColor: 'var(--accent-purple)', color: '#fff' }}>Order Confirmed</span>;
    }
    if (upper === 'SHIPPED') {
      return <span className="badge badge-success">Order Shipped</span>;
    }
    if (upper === 'OUT_FOR_DELIVERY') {
      return <span className="badge badge-warning" style={{ backgroundColor: '#f59e0b', color: '#000' }}>Out for Delivery</span>;
    }
    if (upper === 'DELIVERED') {
      return <span className="badge badge-success" style={{ backgroundColor: '#10b981', color: '#fff' }}>Delivered</span>;
    }
    return <span className="badge badge-cyan">{status}</span>;
  };

  const getReturnStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'RETURN_REQUESTED') return <span className="badge badge-warning">Awaiting Employee Approval</span>;
    if (s === 'RETURN_APPROVED') return <span className="badge badge-success" style={{ backgroundColor: '#8b5cf6', color: '#fff' }}>Return Approved</span>;
    if (s === 'RETURN_SHIPPED') return <span className="badge badge-cyan" style={{ backgroundColor: '#3b82f6', color: '#fff' }}>Return Shipped</span>;
    if (s === 'RETURN_IN_TRANSIT') return <span className="badge badge-warning" style={{ backgroundColor: '#f59e0b', color: '#000' }}>Return In Transit</span>;
    if (s === 'RETURN_RECEIVED') return <span className="badge badge-success" style={{ backgroundColor: '#10b981', color: '#fff' }}>Received by Seller</span>;
    if (s === 'RETURN_COMPLETED') return <span className="badge badge-success" style={{ backgroundColor: '#059669', color: '#fff' }}>Return Completed</span>;
    if (s === 'RETURN_REJECTED') return <span className="badge badge-danger">Return Rejected</span>;
    if (s === 'RETURN_CANCELLED') return <span className="badge badge-danger">Cancelled</span>;
    return <span className="badge badge-warning">{status}</span>;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '1020px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className={`badge badge-${targetDb}`}>{targetDb.toUpperCase()} ENGINE</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Lifecycle & Return Tracking</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Order Management & Visual Tracking</h1>
      </div>

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '1.5rem'
      }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '3px solid var(--accent-purple)' : '3px solid transparent',
            color: activeTab === 'orders' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Package size={17} /> All Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'returns' ? '3px solid var(--accent-purple)' : '3px solid transparent',
            color: activeTab === 'returns' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <RotateCcw size={17} /> Return Requests & Tracking ({returns.length})
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>Loading data...</p>
      ) : activeTab === 'orders' ? (
        /* Orders List */
        orders.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 1rem',
            textAlign: 'center'
          }}>
            <Package size={50} style={{ opacity: 0.4, marginBottom: '1rem' }} />
            <h2>No Orders Found</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              No order transactions recorded under this profile.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map(ord => {
              const isExpanded = expandedId === ord.order_id;
              const isDelivered = (ord.order_status || '').toUpperCase() === 'DELIVERED';

              return (
                <div
                  key={ord.order_id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    transition: 'border-color 0.2s ease',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <strong style={{ fontSize: '1.15rem', color: 'var(--accent-purple)' }}>{ord.order_number}</strong>
                        {getStatusBadge(ord.order_status)}
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span>Ordered: <strong>{ord.order_date}</strong></span>
                        {ord.shipping_date && <span>Shipped: <strong>{ord.shipping_date}</strong></span>}
                        {ord.approx_delivery_date && (
                          <span style={{ color: 'var(--accent-green)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={14} /> Est. Delivery: {ord.approx_delivery_date}
                          </span>
                        )}
                        {role !== 'CUSTOMER' && <span>Customer: <strong>{ord.customer_name}</strong></span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'right', marginRight: '0.5rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Order Total</span>
                        <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          ₹{parseFloat(ord.order_amount).toFixed(2)}
                        </strong>
                      </div>

                      {/* 3PL Courier Tracking Modal Launcher */}
                      <button
                        onClick={() => handleOpenTracking(ord)}
                        style={{
                          background: 'rgba(198, 161, 91, 0.15)',
                          border: '1px solid var(--color-primary)',
                          color: 'var(--color-primary)',
                          padding: '0.45rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                        title="View Live 3PL Courier Tracking & Milestones"
                      >
                        <Truck size={14} /> 3PL Track
                      </button>

                      {/* Customer Cancel Order Button (Pre-dispatch) */}
                      {role === 'CUSTOMER' && ['ORDER_PLACED', 'PENDING_EMPLOYEE', 'PENDING', 'SENT_TO_SELLER', 'ORDER_CONFIRMED', 'PROCESSING'].includes((ord.order_status || '').toUpperCase()) && (
                        <button
                          onClick={() => setCancelOrderObj(ord)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171',
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                          title="Cancel Order prior to dispatch"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      )}

                      {/* Customer Exchange / Replacement Button if Delivered */}
                      {role === 'CUSTOMER' && isDelivered && (
                        <button
                          onClick={() => {
                            setExchangeOrderObj(ord);
                            setSelectedExchangeItem(ord.items?.[0] || null);
                          }}
                          style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            border: '1px solid #3b82f6',
                            color: '#60a5fa',
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                          title="Request product replacement / size exchange"
                        >
                          <RefreshCw size={14} /> Exchange
                        </button>
                      )}

                      {/* Customer Return Button if Delivered */}
                      {role === 'CUSTOMER' && isDelivered && (
                        <button
                          onClick={() => setReturnOrder(ord)}
                          className="btn-secondary-outline"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.82rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            borderColor: '#ec4899',
                            color: '#f472b6'
                          }}
                          title="Initiate Return Request for this order"
                        >
                          <RotateCcw size={14} /> Return Product
                        </button>
                      )}

                      {/* View Invoice */}
                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="btn-primary-block"
                        style={{
                          width: 'auto',
                          marginTop: 0,
                          padding: '0.45rem 0.85rem',
                          fontSize: '0.82rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor: 'var(--accent-purple)'
                        }}
                        title="View PDF Invoice"
                      >
                        <FileText size={15} /> Invoice
                      </button>

                      {/* Toggle Details */}
                      <button
                        onClick={() => toggleExpand(ord.order_id)}
                        className="btn-secondary-outline"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {isExpanded ? 'Hide' : 'Details'}
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Live Order Tracking Visualizer */}
                  <div style={{ marginTop: '1rem' }}>
                    <VisualTracker
                      type="order"
                      status={ord.order_status}
                      history={ord.history || []}
                      courierName={ord.courier_name}
                      trackingNumber={ord.tracking_number}
                      orderNumber={ord.order_number}
                      approxDeliveryDate={ord.approx_delivery_date}
                    />
                  </div>

                  {/* Expanded Items & Address Details */}
                  {isExpanded && (
                    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }} className="animate-fade-in">
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Purchased Products</h4>

                      <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                              <th style={{ padding: '0.5rem' }}>Product</th>
                              <th style={{ padding: '0.5rem' }}>Brand</th>
                              <th style={{ padding: '0.5rem' }}>Unit Price</th>
                              <th style={{ padding: '0.5rem' }}>Quantity</th>
                              <th style={{ padding: '0.5rem' }}>Subtotal</th>
                              {role === 'CUSTOMER' && isDelivered && <th style={{ padding: '0.5rem', textAlign: 'center' }}>Feedback</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {ord.items?.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.5rem', fontWeight: 600 }}>{item.product_name}</td>
                                <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{item.brand}</td>
                                <td style={{ padding: '0.5rem' }}>₹{parseFloat(item.unit_price).toFixed(2)}</td>
                                <td style={{ padding: '0.5rem' }}>{item.quantity}</td>
                                <td style={{ padding: '0.5rem', fontWeight: 700 }}>₹{(parseFloat(item.unit_price) * parseInt(item.quantity)).toFixed(2)}</td>
                                {role === 'CUSTOMER' && isDelivered && (
                                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                    <button
                                      onClick={() => setReviewItem(item)}
                                      style={{
                                        background: 'none',
                                        border: '1px solid var(--accent-purple)',
                                        color: 'var(--accent-purple)',
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        fontSize: '0.78rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                      }}
                                    >
                                      <Star size={13} fill="#f59e0b" color="#f59e0b" /> Feedback
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Shipping & Payment Meta */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                        <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
                          <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Shipping Address:</strong>
                          <p style={{ color: 'var(--text-secondary)' }}>
                            {ord.address ? `${ord.address.street}, ${ord.address.apartment_no ? ord.address.apartment_no + ', ' : ''}${ord.address.city}, ${ord.address.state} - ${ord.address.pincode}` : 'Standard Shipping'}
                          </p>
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
                          <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Payment Info:</strong>
                          <p style={{ color: 'var(--text-secondary)' }}>
                            Mode: <strong>{ord.payment?.payment_mode || 'Online Payment'}</strong> • Status: <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{ord.payment?.payment_status || 'Captured'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Return Requests & Tracking Tab */
        returns.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 1rem',
            textAlign: 'center'
          }}>
            <RotateCcw size={50} style={{ opacity: 0.4, marginBottom: '1rem', color: 'var(--accent-purple)' }} />
            <h2>No Return Requests</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              You have no active or historical return requests. Delivered orders can be returned within 30 days from the Orders tab.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {returns.map(ret => {
              const isApproved = ret.return_status === 'RETURN_APPROVED';
              const isShippedOrBeyond = ['RETURN_SHIPPED', 'RETURN_IN_TRANSIT', 'RETURN_RECEIVED', 'RETURN_COMPLETED'].includes(ret.return_status);
              const isRejected = ret.return_status === 'RETURN_REJECTED';

              return (
                <div
                  key={ret.return_id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <strong style={{ fontSize: '1.15rem', color: '#ec4899' }}>Return ID: {ret.return_id}</strong>
                        {getReturnStatusBadge(ret.return_status)}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <span>Order: <strong>{ret.order_number}</strong></span>
                        <span>Requested: <strong>{ret.request_date}</strong></span>
                        <span>Reason: <strong style={{ color: 'var(--text-primary)' }}>{ret.reason}</strong></span>
                        {ret.refund_amount > 0 && (
                          <span>Refund: <strong style={{ color: 'var(--accent-green)' }}>₹{parseFloat(ret.refund_amount).toFixed(2)}</strong> ({ret.refund_status})</span>
                        )}
                      </div>
                    </div>

                    {/* Ship Return Action Button */}
                    {role === 'CUSTOMER' && isApproved && (
                      <button
                        onClick={() => setShippingReturnReq(ret)}
                        className="btn-primary-block"
                        style={{
                          width: 'auto',
                          marginTop: 0,
                          backgroundColor: '#8b5cf6',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.55rem 1.15rem'
                        }}
                      >
                        <Truck size={17} /> Ship Return
                      </button>
                    )}
                  </div>

                  {/* Customer Comments & Rejection Banner */}
                  {ret.comments && (
                    <div style={{ backgroundColor: 'var(--bg-input)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      <strong>Comments:</strong> {ret.comments}
                    </div>
                  )}

                  {isRejected && ret.rejection_reason && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertCircle size={18} />
                      <span><strong>Rejection Reason:</strong> {ret.rejection_reason}</span>
                    </div>
                  )}

                  {/* Returned Items */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Items in this Return:</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {ret.items?.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--bg-input)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                          <span><strong>{it.product_name}</strong> (Qty: {it.quantity})</span>
                          <span>Unit: ₹{parseFloat(it.unit_price).toFixed(2)} • Subtotal: ₹{(parseFloat(it.unit_price) * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Return Tracking Timeline with Animated Truck */}
                  <VisualTracker
                    type="return"
                    status={ret.return_status}
                    history={ret.status_history || []}
                    courierName={ret.courier_name}
                    trackingNumber={ret.tracking_number}
                    returnId={ret.return_id}
                    orderNumber={ret.order_number}
                    rejectionReason={ret.rejection_reason}
                  />
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Modals */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {returnOrder && (
        <ReturnModal
          order={returnOrder}
          onClose={() => setReturnOrder(null)}
          onSuccess={() => {
            fetchData();
            setActiveTab('returns');
          }}
        />
      )}

      {shippingReturnReq && (
        <ShipReturnModal
          returnReq={shippingReturnReq}
          onClose={() => setShippingReturnReq(null)}
          onSuccess={() => fetchData()}
        />
      )}

      {reviewItem && (
        <ReviewModal
          product={reviewItem}
          onClose={() => setReviewItem(null)}
          onSuccess={() => alert('Thank you for your feedback!')}
        />
      )}

      {/* 3PL Courier Tracking Live Modal */}
      {trackingOrder && (
        <div className="modal-overlay" onClick={() => setTrackingOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={22} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>3PL Courier Transit Details</h3>
              </div>
              <button onClick={() => setTrackingOrder(null)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {trackingLoading || !trackingData ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Connecting to logistics courier gateway...
              </div>
            ) : (
              <div>
                <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Courier Partner:</span>
                    <strong style={{ display: 'block', color: 'var(--color-primary)' }}>{trackingData.courier}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Air Waybill (AWB):</span>
                    <strong style={{ display: 'block' }}>{trackingData.awbNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Current Status:</span>
                    <span className="badge badge-success">{trackingData.currentStatus}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Destination:</span>
                    <strong style={{ display: 'block' }}>{trackingData.destinationCity}</strong>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.85rem' }}>Live Checkpoints:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '2px solid var(--color-primary)', paddingLeft: '1.25rem', marginLeft: '0.5rem' }}>
                  {trackingData.timeline?.map((step, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-1.62rem', top: '0.2rem', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{step.status}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{step.location}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{step.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pre-Dispatch Cancellation Modal */}
      {cancelOrderObj && (
        <div className="modal-overlay" onClick={() => setCancelOrderObj(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <XCircle size={24} color="#ef4444" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Cancel Order #{cancelOrderObj.order_number}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Are you sure you want to cancel this order? Instant refund of <strong>₹{parseFloat(cancelOrderObj.order_amount).toFixed(2)}</strong> will be credited directly to your payment source.
            </p>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Reason for Cancellation</label>
              <select
                className="form-input"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Order placed by mistake">Order placed by mistake</option>
                <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                <option value="Need to change shipping address">Need to change shipping address</option>
                <option value="Expected faster delivery">Expected faster delivery</option>
                <option value="Other / Changed mind">Other / Changed mind</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setCancelOrderObj(null)} className="btn-secondary-outline" style={{ width: 'auto' }}>
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Exchange / Replacement Modal */}
      {exchangeOrderObj && (
        <div className="modal-overlay" onClick={() => setExchangeOrderObj(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <RefreshCw size={22} color="#60a5fa" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Request Product Exchange</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Exchange your item for another size or replacement with <strong>Free Doorstep Reverse Pickup</strong>!
            </p>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Item to Exchange</label>
              <select
                className="form-input"
                value={selectedExchangeItem?.item_id}
                onChange={(e) => {
                  const it = exchangeOrderObj.items?.find(i => i.item_id === e.target.value);
                  setSelectedExchangeItem(it);
                }}
              >
                {exchangeOrderObj.items?.map(it => (
                  <option key={it.item_id} value={it.item_id}>
                    {it.product_name} (Qty: {it.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Exchange Reason</label>
              <select
                className="form-input"
                value={exchangeReason}
                onChange={(e) => setExchangeReason(e.target.value)}
              >
                <option value="Size / fit too small">Size / fit too small</option>
                <option value="Size / fit too large">Size / fit too large</option>
                <option value="Color preference change">Color preference change</option>
                <option value="Minor performance / aesthetic imperfection">Minor performance / aesthetic imperfection</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Requested Replacement Variant / Note</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Size Large instead of Medium, or Navy Blue"
                value={replacementVariant}
                onChange={(e) => setReplacementVariant(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setExchangeOrderObj(null)} className="btn-secondary-outline" style={{ width: 'auto' }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmExchange}
                disabled={exchanging}
                className="btn-primary-block"
                style={{ width: 'auto', marginTop: 0, padding: '0.55rem 1.25rem' }}
              >
                {exchanging ? 'Submitting...' : 'Confirm Exchange Pickup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
