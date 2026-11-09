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
  Calendar,
  RotateCcw,
  Check,
  X,
  MessageSquare,
  Flag,
  EyeOff,
  Eye,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';
import VisualTracker from '../components/VisualTracker';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { targetDb } = useDb();

  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // requests | sent | confirmed | shipped | delivered | returns | feedback
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Return Rejection Modal state
  const [rejectingReturnId, setRejectingReturnId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Moderation state
  const [moderationReason, setModerationReason] = useState('');
  const [activeModerationReview, setActiveModerationReview] = useState(null);
  const [moderationAction, setModerationAction] = useState(''); // 'flag' | 'hide'
  const [assignmentFilter, setAssignmentFilter] = useState('all'); // 'all' | 'mine' | 'unassigned'

  useEffect(() => {
    fetchAllData();
  }, [targetDb]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [ordersRes, returnsRes, reviewsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/returns').catch(() => ({ data: [] })),
        api.get('/reviews/admin').catch(() => ({ data: [] }))
      ]);
      setOrders(ordersRes.data || []);
      setReturns(returnsRes.data || []);
      setReviews(reviewsRes.data || []);
    } catch (err) {
      console.error('Failed to load employee dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimOrder = async (orderId) => {
    try {
      setActionLoading(orderId);
      await api.put(`/orders/${orderId}/assign`, {});
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign order to yourself.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleForwardToSeller = async (orderId) => {
    try {
      setActionLoading(orderId);
      await api.post(`/orders/${orderId}/forward`);
      await fetchAllData();
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
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to mark order as delivered.');
    } finally {
      setActionLoading(null);
    }
  };

  // Return actions
  const handleApproveReturn = async (returnId) => {
    try {
      setActionLoading(returnId);
      await api.post(`/returns/${returnId}/approve`);
      alert('Return request approved! Customer has been notified and can now ship.');
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve return.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmRejectReturn = async (e) => {
    e.preventDefault();
    if (!rejectingReturnId) return;
    try {
      setActionLoading(rejectingReturnId);
      await api.post(`/returns/${rejectingReturnId}/reject`, {
        rejection_reason: rejectionReason || 'Request does not meet return eligibility criteria.'
      });
      alert('Return request rejected. Customer has been notified with the rejection reason.');
      setRejectingReturnId(null);
      setRejectionReason('');
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject return.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkReturnInTransit = async (returnId) => {
    try {
      setActionLoading(returnId);
      await api.post(`/returns/${returnId}/transit`);
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to mark return in transit.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteReturn = async (returnId) => {
    try {
      setActionLoading(returnId);
      await api.post(`/returns/${returnId}/complete`);
      alert('Return completed! Product restocked and refund initiated.');
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to complete return.');
    } finally {
      setActionLoading(null);
    }
  };

  // Review moderation actions
  const handleExecuteModeration = async (e) => {
    e.preventDefault();
    if (!activeModerationReview) return;
    try {
      setActionLoading(activeModerationReview.review_id);
      if (moderationAction === 'flag') {
        await api.post(`/reviews/${activeModerationReview.review_id}/flag`, { reason: moderationReason });
        alert('Review flagged for content review.');
      } else if (moderationAction === 'hide') {
        await api.post(`/reviews/${activeModerationReview.review_id}/hide`, { reason: moderationReason });
        alert('Review hidden from catalog.');
      }
      setActiveModerationReview(null);
      setModerationReason('');
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Moderation action failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnhideReview = async (reviewId) => {
    try {
      setActionLoading(reviewId);
      await api.post(`/reviews/${reviewId}/unhide`);
      alert('Review unhidden and restored to public catalog.');
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to restore review.');
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

  const pendingReturnRequests = returns.filter(r => r.return_status === 'RETURN_REQUESTED');
  const activeReturnShipments = returns.filter(r =>
    ['RETURN_APPROVED', 'RETURN_SHIPPED', 'RETURN_IN_TRANSIT', 'RETURN_RECEIVED'].includes(r.return_status)
  );

  const currentEmployeeId = user?.ref_id || user?.profile?.employee_id || '';
  const myAssignedOrdersCount = orders.filter(o => o.assigned_employee_id && o.assigned_employee_id === currentEmployeeId).length;
  const unassignedOrdersCount = orders.filter(o => !o.assigned_employee_id).length;

  const filterByAssignment = (list) => {
    if (assignmentFilter === 'mine') {
      return list.filter(o => o.assigned_employee_id && o.assigned_employee_id === currentEmployeeId);
    }
    if (assignmentFilter === 'unassigned') {
      return list.filter(o => !o.assigned_employee_id);
    }
    return list;
  };

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
            <span className={`badge badge-${targetDb}`}>{targetDb.toUpperCase()} ENGINE ACTIVE</span>
            <span className="badge badge-success">EMPLOYEE WORKFLOW CONSOLE</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Employee Operations Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Logged in: <strong style={{ color: 'var(--text-primary)' }}>{user?.email}</strong> • Managing Orders, Returns & Reviews
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('returns')}
            className="btn-primary-block"
            style={{ padding: '0.65rem 1.25rem', marginTop: 0, backgroundColor: '#ec4899', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={17} /> Return Requests ({pendingReturnRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className="btn-secondary-outline"
            style={{ padding: '0.65rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <MessageSquare size={17} /> Feedback ({reviews.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: '0 0 10px rgba(212, 175, 55, 0.15)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>Assigned to You</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{myAssignedOrdersCount}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>New Orders</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{pendingRequests.length}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sent to Sellers</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{sentToSellerOrders.length}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Seller Confirmed</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{confirmedOrders.length}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Shipped</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>{shippedOrders.length}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Returns</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ec4899' }}>{pendingReturnRequests.length}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Delivered Orders</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>{deliveredOrders.length}</div>
        </div>
      </div>

      {/* Workflow Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: activeTab === 'requests' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'requests' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Clock size={16} /> New Requests ({pendingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: activeTab === 'sent' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'sent' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Send size={16} /> Forwarded ({sentToSellerOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('confirmed')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: activeTab === 'confirmed' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'confirmed' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <ShieldCheck size={16} /> Confirmed ({confirmedOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('shipped')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: activeTab === 'shipped' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'shipped' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Truck size={16} /> Shipped ({shippedOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('delivered')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: activeTab === 'delivered' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'delivered' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <CheckCircle size={16} /> Delivered ({deliveredOrders.length})
        </button>

        {/* Dedicated Return Approvals Tab */}
        <button
          onClick={() => setActiveTab('returns')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: activeTab === 'returns' ? '#ec4899' : 'transparent',
            color: activeTab === 'returns' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={16} /> Return Requests & Approvals ({returns.length})
        </button>

        {/* Dedicated Feedback Management Tab */}
        <button
          onClick={() => setActiveTab('feedback')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: activeTab === 'feedback' ? '#10b981' : 'transparent',
            color: activeTab === 'feedback' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <MessageSquare size={16} /> Feedback Moderation ({reviews.length})
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>Loading data records...</p>
      ) : activeTab === 'returns' ? (
        /* Return Requests & Approval Section */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {returns.length === 0 ? (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '3.5rem 1rem', textAlign: 'center' }}>
              <RotateCcw size={40} style={{ opacity: 0.4, marginBottom: '0.75rem', color: '#ec4899' }} />
              <h3>No Return Requests</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No incoming customer returns in the system.</p>
            </div>
          ) : (
            returns.map(ret => {
              const isPending = ret.return_status === 'RETURN_REQUESTED';
              const isApproved = ret.return_status === 'RETURN_APPROVED';
              const isShipped = ret.return_status === 'RETURN_SHIPPED';
              const isInTransit = ret.return_status === 'RETURN_IN_TRANSIT';
              const isReceived = ret.return_status === 'RETURN_RECEIVED';
              const isCompleted = ret.return_status === 'RETURN_COMPLETED';
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
                        <strong style={{ fontSize: '1.15rem', color: '#ec4899' }}>{ret.return_id}</strong>
                        <span className="badge badge-warning" style={{ backgroundColor: isPending ? '#f59e0b' : isCompleted ? '#10b981' : isRejected ? '#ef4444' : '#8b5cf6', color: '#fff' }}>
                          {ret.return_status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <span>Order: <strong>{ret.order_number}</strong></span>
                        <span>Customer: <strong>{ret.customer_name}</strong> ({ret.customer_email})</span>
                        <span>Date: <strong>{ret.request_date}</strong></span>
                        <span>Reason: <strong style={{ color: 'var(--text-primary)' }}>{ret.reason}</strong></span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleApproveReturn(ret.return_id)}
                            disabled={actionLoading === ret.return_id}
                            className="btn-primary-block"
                            style={{
                              width: 'auto',
                              marginTop: 0,
                              backgroundColor: '#10b981',
                              padding: '0.45rem 1rem',
                              fontSize: '0.85rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            <Check size={16} /> Accept Request
                          </button>
                          <button
                            onClick={() => {
                              setRejectingReturnId(ret.return_id);
                              setRejectionReason('');
                            }}
                            disabled={actionLoading === ret.return_id}
                            className="btn-secondary-outline"
                            style={{
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              padding: '0.45rem 1rem',
                              fontSize: '0.85rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            <X size={16} /> Reject Request
                          </button>
                        </>
                      )}

                      {isShipped && (
                        <button
                          onClick={() => handleMarkReturnInTransit(ret.return_id)}
                          disabled={actionLoading === ret.return_id}
                          className="btn-primary-block"
                          style={{
                            width: 'auto',
                            marginTop: 0,
                            backgroundColor: '#3b82f6',
                            padding: '0.45rem 1rem',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Truck size={16} /> Mark In Transit
                        </button>
                      )}

                      {isReceived && (
                        <button
                          onClick={() => handleCompleteReturn(ret.return_id)}
                          disabled={actionLoading === ret.return_id}
                          className="btn-primary-block"
                          style={{
                            width: 'auto',
                            marginTop: 0,
                            backgroundColor: '#10b981',
                            padding: '0.45rem 1rem',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <CheckCircle size={16} /> Finalize Return & Refund
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Customer Details & Comments */}
                  {ret.comments && (
                    <div style={{ backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                      <strong>Customer Comments:</strong> {ret.comments}
                    </div>
                  )}

                  {ret.image_url && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Attached Photo Evidence:</span>
                      <a href={ret.image_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-purple)', fontSize: '0.85rem', textDecoration: 'underline' }}>
                        View Uploaded Image ↗
                      </a>
                    </div>
                  )}

                  {isRejected && ret.rejection_reason && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                      <strong>Rejection Reason:</strong> {ret.rejection_reason}
                    </div>
                  )}

                  {/* Items in Return */}
                  <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Returned Products:</span>
                    {ret.items?.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: idx < ret.items.length - 1 ? '1px dashed var(--border-color)' : 'none', padding: '0.3rem 0' }}>
                        <span><strong>{it.product_name}</strong> (Qty: {it.quantity})</span>
                        <span>Unit: ₹{parseFloat(it.unit_price).toFixed(2)} • Subtotal: ₹{(parseFloat(it.unit_price) * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Live Visual Tracker for Return */}
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
            })
          )}
        </div>
      ) : activeTab === 'feedback' ? (
        /* Feedback Moderation Section */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.length === 0 ? (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '3.5rem 1rem', textAlign: 'center' }}>
              <MessageSquare size={40} style={{ opacity: 0.4, marginBottom: '0.75rem', color: '#10b981' }} />
              <h3>No Customer Reviews</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No reviews have been submitted by customers yet.</p>
            </div>
          ) : (
            reviews.map(r => (
              <div
                key={r.review_id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>{r.customer_name}</strong>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Verified Purchase</span>
                      {r.is_flagged && <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Flagged</span>}
                      {r.is_hidden && <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>Hidden from Catalog</span>}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Product: <strong>{r.product_name}</strong> • Date: {r.review_date}
                    </div>
                  </div>

                  {/* Moderation Controls */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!r.is_hidden ? (
                      <button
                        onClick={() => {
                          setActiveModerationReview(r);
                          setModerationAction('hide');
                          setModerationReason('');
                        }}
                        className="btn-secondary-outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', borderColor: '#ef4444', color: '#ef4444' }}
                        title="Hide from public catalog"
                      >
                        <EyeOff size={14} /> Hide Review
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnhideReview(r.review_id)}
                        className="btn-secondary-outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', borderColor: '#10b981', color: '#10b981' }}
                        title="Restore to public catalog"
                      >
                        <Eye size={14} /> Restore Review
                      </button>
                    )}

                    {!r.is_flagged && (
                      <button
                        onClick={() => {
                          setActiveModerationReview(r);
                          setModerationAction('flag');
                          setModerationReason('');
                        }}
                        className="btn-secondary-outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', borderColor: '#f59e0b', color: '#f59e0b' }}
                        title="Flag for review"
                      >
                        <Flag size={14} /> Flag
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} style={{ fontSize: '1.1rem' }}>{s <= r.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{r.rating} / 5</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  "{r.description}"
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Orders Workflow Lists */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Assignment Filter Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            backgroundColor: 'var(--bg-card)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <UserCheck size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontWeight: 600 }}>Filter Orders by Assignment:</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setAssignmentFilter('all')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  backgroundColor: assignmentFilter === 'all' ? 'var(--color-primary)' : 'var(--bg-input)',
                  color: assignmentFilter === 'all' ? '#000' : 'var(--text-secondary)'
                }}
              >
                All Orders ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setAssignmentFilter('mine')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  backgroundColor: assignmentFilter === 'mine' ? '#10b981' : 'var(--bg-input)',
                  color: assignmentFilter === 'mine' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Assigned to Me ({myAssignedOrdersCount})
              </button>
              <button
                type="button"
                onClick={() => setAssignmentFilter('unassigned')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  backgroundColor: assignmentFilter === 'unassigned' ? '#f59e0b' : 'var(--bg-input)',
                  color: assignmentFilter === 'unassigned' ? '#000' : 'var(--text-secondary)'
                }}
              >
                Unassigned ({unassignedOrdersCount})
              </button>
            </div>
          </div>

          {activeTab === 'requests' && (
            filterByAssignment(pendingRequests).length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No pending order requests match the current filter.</p>
            ) : (
              filterByAssignment(pendingRequests).map(ord => (
                <OrderCard
                  key={ord.order_id}
                  ord={ord}
                  expanded={expandedOrder === ord.order_id}
                  onToggle={() => toggleExpand(ord.order_id)}
                  onInvoice={() => setSelectedInvoiceOrder(ord)}
                  currentEmployeeId={currentEmployeeId}
                  onClaim={handleClaimOrder}
                  actionLoading={actionLoading}
                  actionButton={
                    <button
                      onClick={() => handleForwardToSeller(ord.order_id)}
                      disabled={actionLoading === ord.order_id}
                      className="btn-primary-block"
                      style={{ width: 'auto', marginTop: 0, padding: '0.45rem 1rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#0284c7' }}
                    >
                      <Send size={15} /> Forward to Seller
                    </button>
                  }
                />
              ))
            )
          )}

          {activeTab === 'sent' && (
            filterByAssignment(sentToSellerOrders).length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No orders currently awaiting seller confirmation match filter.</p>
            ) : (
              filterByAssignment(sentToSellerOrders).map(ord => (
                <OrderCard
                  key={ord.order_id}
                  ord={ord}
                  expanded={expandedOrder === ord.order_id}
                  onToggle={() => toggleExpand(ord.order_id)}
                  onInvoice={() => setSelectedInvoiceOrder(ord)}
                  currentEmployeeId={currentEmployeeId}
                  onClaim={handleClaimOrder}
                  actionLoading={actionLoading}
                  actionBadge={<span className="badge badge-cyan" style={{ backgroundColor: '#0284c7', color: '#fff' }}>Awaiting Seller Confirmation</span>}
                />
              ))
            )
          )}

          {activeTab === 'confirmed' && (
            filterByAssignment(confirmedOrders).length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No seller-confirmed orders match filter.</p>
            ) : (
              filterByAssignment(confirmedOrders).map(ord => (
                <OrderCard
                  key={ord.order_id}
                  ord={ord}
                  expanded={expandedOrder === ord.order_id}
                  onToggle={() => toggleExpand(ord.order_id)}
                  onInvoice={() => setSelectedInvoiceOrder(ord)}
                  currentEmployeeId={currentEmployeeId}
                  onClaim={handleClaimOrder}
                  actionLoading={actionLoading}
                  actionBadge={<span className="badge badge-success" style={{ backgroundColor: 'var(--accent-purple)', color: '#fff' }}>Confirmed by Seller</span>}
                />
              ))
            )
          )}

          {activeTab === 'shipped' && (
            filterByAssignment(shippedOrders).length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No orders currently in transit match filter.</p>
            ) : (
              filterByAssignment(shippedOrders).map(ord => (
                <OrderCard
                  key={ord.order_id}
                  ord={ord}
                  expanded={expandedOrder === ord.order_id}
                  onToggle={() => toggleExpand(ord.order_id)}
                  onInvoice={() => setSelectedInvoiceOrder(ord)}
                  currentEmployeeId={currentEmployeeId}
                  onClaim={handleClaimOrder}
                  actionLoading={actionLoading}
                  actionButton={
                    <button
                      onClick={() => handleMarkAsDelivered(ord.order_id)}
                      disabled={actionLoading === ord.order_id}
                      className="btn-primary-block"
                      style={{ width: 'auto', marginTop: 0, padding: '0.45rem 1rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#10b981' }}
                    >
                      <CheckCircle size={15} /> Confirm Delivered
                    </button>
                  }
                />
              ))
            )
          )}

          {activeTab === 'delivered' && (
            filterByAssignment(deliveredOrders).length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No delivered orders match filter.</p>
            ) : (
              filterByAssignment(deliveredOrders).map(ord => (
                <OrderCard
                  key={ord.order_id}
                  ord={ord}
                  expanded={expandedOrder === ord.order_id}
                  onToggle={() => toggleExpand(ord.order_id)}
                  onInvoice={() => setSelectedInvoiceOrder(ord)}
                  currentEmployeeId={currentEmployeeId}
                  onClaim={handleClaimOrder}
                  actionLoading={actionLoading}
                  actionBadge={<span className="badge badge-success" style={{ backgroundColor: '#10b981', color: '#fff' }}>Delivered to Customer</span>}
                />
              ))
            )
          )}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingReturnId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '480px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ef4444' }}>Reject Return Request</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Please provide the official reason for rejecting return request <strong>{rejectingReturnId}</strong>:
            </p>
            <form onSubmit={handleConfirmRejectReturn}>
              <textarea
                className="form-input"
                rows="4"
                placeholder="e.g. Return window expired, physical tampering observed, or policy violation..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              ></textarea>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setRejectingReturnId(null)} className="btn-secondary-outline" style={{ width: 'auto' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-block" style={{ width: 'auto', marginTop: 0, backgroundColor: '#ef4444' }}>
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Moderation Modal */}
      {activeModerationReview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '480px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {moderationAction === 'hide' ? 'Hide Inappropriate Review' : 'Flag Review for Investigation'}
            </h3>
            <form onSubmit={handleExecuteModeration}>
              <div className="form-group">
                <label className="form-label">Moderation Note / Reason</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Enter reason for this action..."
                  value={moderationReason}
                  onChange={(e) => setModerationReason(e.target.value)}
                  required
                ></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setActiveModerationReview(null)} className="btn-secondary-outline" style={{ width: 'auto' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-block" style={{ width: 'auto', marginTop: 0 }}>
                  Confirm Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

// Sub-component for Order Cards
function OrderCard({ ord, expanded, onToggle, onInvoice, actionButton, actionBadge, currentEmployeeId, onClaim, actionLoading }) {
  const isAssignedToMe = Boolean(ord.assigned_employee_id && currentEmployeeId && ord.assigned_employee_id === currentEmployeeId);
  const isUnassigned = !ord.assigned_employee_id;

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: '1.1rem', color: 'var(--accent-purple)' }}>{ord.order_number}</strong>
            <span className="badge badge-success">{ord.order_status}</span>
            {isAssignedToMe ? (
              <span className="badge badge-success" style={{ backgroundColor: '#10b981', color: '#fff', fontSize: '0.72rem', fontWeight: 700 }}>
                ✓ Assigned to You
              </span>
            ) : isUnassigned ? (
              <span className="badge badge-warning" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid #f59e0b', fontSize: '0.72rem' }}>
                Unassigned
              </span>
            ) : (
              <span className="badge badge-secondary" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', fontSize: '0.72rem' }}>
                Assigned: {ord.assigned_employee_name || ord.assigned_employee_id}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span>Customer: <strong>{ord.customer_name}</strong></span>
            <span>Date: <strong>{ord.order_date}</strong></span>
            <span>Total: <strong style={{ color: 'var(--text-primary)' }}>₹{parseFloat(ord.order_amount).toFixed(2)}</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isUnassigned && onClaim && (
            <button
              onClick={() => onClaim(ord.order_id)}
              disabled={actionLoading === ord.order_id}
              className="btn-secondary-outline"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              title="Assign this order to yourself"
            >
              <UserCheck size={14} /> Assign to Me
            </button>
          )}
          <button onClick={onInvoice} className="btn-secondary-outline" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <FileText size={14} /> Invoice
          </button>
          {actionButton}
          {actionBadge}
          <button onClick={onToggle} className="btn-secondary-outline" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />} {expanded ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {/* Order visual tracker */}
      <div style={{ marginTop: '0.75rem' }}>
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

      {expanded && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <h5 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>Items in this order:</h5>
          <div style={{ backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
            {ord.items?.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0' }}>
                <span>{it.product_name} (Qty: {it.quantity})</span>
                <span>₹{(parseFloat(it.unit_price) * it.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>Shipping To:</strong> {ord.address ? `${ord.address.street}, ${ord.address.city}, ${ord.address.state}` : 'Standard Shipping'}
          </div>
        </div>
      )}
    </div>
  );
}
