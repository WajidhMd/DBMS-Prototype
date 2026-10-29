import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Layers,
  Check,
  X,
  ShieldAlert,
  Image as ImageIcon,
  Truck,
  ShieldCheck,
  FileText,
  Calendar,
  RotateCcw,
  Star,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';
import VisualTracker from '../components/VisualTracker';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { targetDb } = useDb();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // orders | products | returns | reviews
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Add/Edit Product Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [prodForm, setProdForm] = useState({
    product_name: '',
    brand: '',
    mrp: '',
    stock_qty: 10,
    category_id: '',
    is_active: true,
    image_url: ''
  });

  useEffect(() => {
    fetchSellerData();
  }, [targetDb]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, ordRes, retRes] = await Promise.all([
        api.get(`/products?seller_id=${user?.ref_id}`),
        api.get('/categories'),
        api.get('/orders'),
        api.get('/returns').catch(() => ({ data: [] }))
      ]);

      const myProducts = prodRes.data || [];
      setProducts(myProducts);
      setCategories(catRes.data || []);
      setOrders(ordRes.data || []);
      setReturns(retRes.data || []);

      // Fetch reviews for this seller's products
      if (myProducts.length > 0) {
        const prodReviewsPromises = myProducts.map(p =>
          api.get(`/reviews?product_id=${p.product_id}`).then(r => r.data || []).catch(() => [])
        );
        const allReviewsArrays = await Promise.all(prodReviewsPromises);
        setReviews(allReviewsArrays.flat());
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error('Failed to load seller dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSellerConfirm = async (orderId) => {
    try {
      setActionLoading(orderId);
      await api.post(`/orders/${orderId}/seller-confirm`);
      await fetchSellerData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to confirm order.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendShippingRequest = async (orderId) => {
    try {
      setActionLoading(orderId);
      await api.post(`/orders/${orderId}/request-shipping`);
      await fetchSellerData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send shipping request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmReturnReceived = async (returnId) => {
    try {
      setActionLoading(returnId);
      await api.post(`/returns/${returnId}/received`);
      alert('Return delivery confirmed! Employee team can now finalize the return and refund.');
      await fetchSellerData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to confirm receipt of return.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setProdForm({
      product_name: '',
      brand: '',
      mrp: '',
      stock_qty: 20,
      category_id: categories[0]?.category_id || '',
      is_active: true,
      image_url: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.product_id);
    setProdForm({
      product_name: p.product_name,
      brand: p.brand,
      mrp: p.mrp,
      stock_qty: p.stock_qty,
      category_id: p.category_id,
      is_active: p.is_active,
      image_url: p.image_url || ''
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchSellerData();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, prodForm);
      } else {
        await api.post('/products', {
          ...prodForm,
          seller_id: user?.ref_id
        });
      }
      setShowModal(false);
      fetchSellerData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save product.');
    }
  };

  // Derive total revenue
  const totalSalesAmount = orders.reduce((acc, o) => {
    const isCompleted = o.order_status === 'DELIVERED';
    return isCompleted ? acc + parseFloat(o.order_amount) : acc;
  }, 0);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Seller Header Banner */}
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
            <span className="badge badge-warning">SELLER VENDOR PORTAL</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user?.profile?.name || 'Seller Dashboard'}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Email: {user?.email} • Managing inventory, orders & returns for <strong>{user?.profile?.name}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handleOpenAdd} className="btn-primary-block" style={{ width: 'auto', padding: '0.65rem 1.25rem', marginTop: 0 }}>
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </div>

      {/* Seller Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Listed Products</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{products.length}</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)' }}>
            <Check size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Listed Items</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{products.filter(p => p.is_active).length}</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
            <RotateCcw size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Returned Shipments</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ec4899' }}>{returns.length}</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Revenue</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>${totalSalesAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Seller Portal Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'orders' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'orders' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Package size={16} /> Forwarded Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'products' ? 'var(--accent-purple)' : 'transparent',
            color: activeTab === 'products' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Layers size={16} /> My Product Catalog ({products.length})
        </button>

        {/* Dedicated Returned Products Tab */}
        <button
          onClick={() => setActiveTab('returns')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'returns' ? '#ec4899' : 'transparent',
            color: activeTab === 'returns' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={16} /> Returned Products & Shipments ({returns.length})
        </button>

        {/* Dedicated Reviews Tab */}
        <button
          onClick={() => setActiveTab('reviews')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: activeTab === 'reviews' ? '#10b981' : 'transparent',
            color: activeTab === 'reviews' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Star size={16} /> Product Reviews & Ratings ({reviews.length})
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>Loading seller records...</p>
      ) : activeTab === 'returns' ? (
        /* RETURNED PRODUCTS SECTION */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {returns.length === 0 ? (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '3.5rem 1rem', textAlign: 'center' }}>
              <RotateCcw size={40} style={{ opacity: 0.4, marginBottom: '0.75rem', color: '#ec4899' }} />
              <h3>No Returned Products</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>None of your sold products have active return requests or shipments.</p>
            </div>
          ) : (
            returns.map(ret => {
              const isShipped = ret.return_status === 'RETURN_SHIPPED' || ret.return_status === 'RETURN_IN_TRANSIT';
              const isReceived = ret.return_status === 'RETURN_RECEIVED' || ret.return_status === 'RETURN_COMPLETED';

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
                        <span className="badge badge-warning" style={{ backgroundColor: isReceived ? '#10b981' : '#8b5cf6', color: '#fff' }}>
                          {ret.return_status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <span>Order: <strong>{ret.order_number}</strong></span>
                        <span>Customer: <strong>{ret.customer_name}</strong></span>
                        <span>Requested: <strong>{ret.request_date}</strong></span>
                        {ret.shipment_date && <span>Shipped: <strong>{ret.shipment_date}</strong></span>}
                      </div>
                    </div>

                    {/* Seller Confirm Receipt Action */}
                    {isShipped && (
                      <button
                        onClick={() => handleConfirmReturnReceived(ret.return_id)}
                        disabled={actionLoading === ret.return_id}
                        className="btn-primary-block"
                        style={{
                          width: 'auto',
                          marginTop: 0,
                          backgroundColor: '#10b981',
                          padding: '0.5rem 1.15rem',
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <CheckCircle size={16} /> Confirm Receipt of Product
                      </button>
                    )}
                  </div>

                  {/* Return details: Reason & Comments */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Return Reason:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{ret.reason}</strong>
                    </div>
                    {ret.comments && (
                      <div style={{ backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Customer Comments:</span>
                        <span>{ret.comments}</span>
                      </div>
                    )}
                  </div>

                  {/* Products Belonging to This Seller in This Return */}
                  <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Your Returned Products:</span>
                    {ret.items?.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: idx < ret.items.length - 1 ? '1px dashed var(--border-color)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Package size={18} color="var(--accent-purple)" />
                          <div>
                            <strong>{it.product_name}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Brand: {it.brand || 'Your Brand'}</div>
                          </div>
                        </div>
                        <div>
                          <strong>{it.quantity} units</strong> • Subtotal: ${(parseFloat(it.unit_price) * it.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Visual Timeline Tracking */}
                  <VisualTracker
                    type="return"
                    status={ret.return_status}
                    history={ret.status_history || []}
                    courierName={ret.courier_name}
                    trackingNumber={ret.tracking_number}
                    returnId={ret.return_id}
                    orderNumber={ret.order_number}
                  />
                </div>
              );
            })
          )}
        </div>
      ) : activeTab === 'reviews' ? (
        /* REVIEWS TAB */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.length === 0 ? (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '3.5rem 1rem', textAlign: 'center' }}>
              <Star size={40} style={{ opacity: 0.4, marginBottom: '0.75rem', color: '#f59e0b' }} />
              <h3>No Customer Reviews Yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>When verified buyers review your listed items, their feedback and ratings will appear here.</p>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '0.98rem' }}>{r.customer_name}</strong>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Verified Purchase</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.review_date}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} style={{ fontSize: '1.1rem' }}>{s <= r.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{r.rating} / 5</span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  "{r.description}"
                </p>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'orders' ? (
        /* FORWARDED ORDERS TAB */
        orders.length === 0 ? (
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '3.5rem 1rem', textAlign: 'center' }}>
            <Package size={40} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
            <p>No orders assigned to your catalog at this time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map(ord => {
              const isConfirmed = ord.order_status === 'ORDER_CONFIRMED';
              const isPending = ord.order_status === 'SENT_TO_SELLER';

              return (
                <div key={ord.order_id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--accent-purple)' }}>{ord.order_number}</strong>
                        <span className="badge badge-success">{ord.order_status}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <span>Customer: <strong>{ord.customer_name}</strong></span>
                        <span>Date: <strong>{ord.order_date}</strong></span>
                        <span>Total: <strong>${parseFloat(ord.order_amount).toFixed(2)}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button onClick={() => setSelectedInvoiceOrder(ord)} className="btn-secondary-outline" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FileText size={14} /> Invoice
                      </button>

                      {isPending && (
                        <button
                          onClick={() => handleSellerConfirm(ord.order_id)}
                          disabled={actionLoading === ord.order_id}
                          className="btn-primary-block"
                          style={{ width: 'auto', marginTop: 0, padding: '0.45rem 1rem', fontSize: '0.82rem', backgroundColor: 'var(--accent-purple)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          <ShieldCheck size={15} /> Confirm Order
                        </button>
                      )}

                      {isConfirmed && (
                        <button
                          onClick={() => handleSendShippingRequest(ord.order_id)}
                          disabled={actionLoading === ord.order_id}
                          className="btn-primary-block"
                          style={{ width: 'auto', marginTop: 0, padding: '0.45rem 1rem', fontSize: '0.82rem', backgroundColor: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          <Truck size={15} /> Request Courier Shipping
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Visual Tracker */}
                  <div style={{ marginTop: '0.85rem' }}>
                    <VisualTracker
                      type="order"
                      status={ord.order_status}
                      history={ord.history || []}
                      courierName={ord.courier_name}
                      trackingNumber={ord.tracking_number}
                      orderNumber={ord.order_number}
                    />
                  </div>

                  {/* Ordered Items list */}
                  <div style={{ marginTop: '0.85rem', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Items to Fulfill:</span>
                    {ord.items?.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                        <span><strong>{it.product_name}</strong> (Qty: {it.quantity})</span>
                        <span>${(parseFloat(it.unit_price) * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* PRODUCTS CATALOG TAB */
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Product</th>
                <th style={{ padding: '0.75rem 1rem' }}>Brand</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                <th style={{ padding: '0.75rem 1rem' }}>Stock</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.product_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{p.product_name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{p.brand}</td>
                  <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-cyan">{p.category_name || 'Category'}</span></td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>${parseFloat(p.mrp).toFixed(2)}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{p.stock_qty}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`badge ${p.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenEdit(p)} className="btn-secondary-outline" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}>
                        <Edit2 size={13} /> Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(p.product_id)} className="btn-secondary-outline" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '520px', padding: '1.75rem', boxShadow: 'var(--shadow-glow)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={prodForm.product_name}
                  onChange={(e) => setProdForm({ ...prodForm, product_name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={prodForm.brand}
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input"
                    value={prodForm.category_id}
                    onChange={(e) => setProdForm({ ...prodForm, category_id: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">MRP ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={prodForm.mrp}
                    onChange={(e) => setProdForm({ ...prodForm, mrp: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={prodForm.stock_qty}
                    onChange={(e) => setProdForm({ ...prodForm, stock_qty: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://... product photo"
                  value={prodForm.image_url}
                  onChange={(e) => setProdForm({ ...prodForm, image_url: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="is_active_check"
                  checked={prodForm.is_active}
                  onChange={(e) => setProdForm({ ...prodForm, is_active: e.target.checked })}
                />
                <label htmlFor="is_active_check" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Is Product Active & Available for Purchase
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary-outline" style={{ width: 'auto' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-block" style={{ width: 'auto', marginTop: 0 }}>
                  Save Product
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
