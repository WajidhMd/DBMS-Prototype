import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import { Package, Plus, Edit2, Trash2, DollarSign, Layers, Check, X, ShieldAlert, Image as ImageIcon, Truck, ShieldCheck, FileText, Calendar } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { targetDb } = useDb();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // orders | products
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
      const [prodRes, catRes, ordRes] = await Promise.all([
        api.get(`/products?seller_id=${user?.ref_id}`),
        api.get('/categories'),
        api.get('/orders')
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setOrders(ordRes.data || []);
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
      is_active: Boolean(p.is_active),
      image_url: p.image_url || ''
    });
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, prodForm);
      } else {
        await api.post('/products', prodForm);
      }
      setShowModal(false);
      fetchSellerData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete/deactivate this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchSellerData();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  // Calculate derived total sales for this seller
  let totalSalesAmount = 0;
  orders.forEach(o => {
    o.items?.forEach(item => {
      if (item.seller_id === user?.ref_id) {
        totalSalesAmount += (parseFloat(item.unit_price) * parseInt(item.quantity));
      }
    });
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
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
            Email: {user?.email} • Managing products & order confirmations for <strong>{user?.profile?.name}</strong>
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary-block" style={{ width: 'auto', padding: '0.65rem 1.25rem' }}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Seller Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Sales Revenue (Derived)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>${totalSalesAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Seller Portal Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
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
            color: activeTab === 'orders' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <Package size={16} /> Employee-Forwarded Orders ({orders.length})
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
            color: activeTab === 'products' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <Layers size={16} /> My Product Catalog ({products.length})
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Orders Forwarded by Employee to Seller
          </h2>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading seller orders...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              <Package size={40} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.95rem' }}>No orders currently forwarded by Employee to your seller account.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(ord => {
                const statusUpper = (ord.order_status || '').toUpperCase();
                const isSentToSeller = statusUpper === 'SENT_TO_SELLER';
                const isConfirmed = statusUpper === 'ORDER_CONFIRMED';
                const isShipped = statusUpper === 'SHIPPED';
                const isDelivered = statusUpper === 'DELIVERED';

                return (
                  <div
                    key={ord.order_id}
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--accent-purple)' }}>{ord.order_number}</strong>
                          <span className="badge badge-mysql">
                            {isSentToSeller ? 'Forwarded to Seller' :
                             isConfirmed ? 'Order Confirmed by Seller' :
                             isShipped ? 'Order Shipped' :
                             isDelivered ? 'Delivered' : ord.order_status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span>Customer: <strong>{ord.customer_name}</strong></span>
                          <span>Date: <strong>{ord.order_date}</strong></span>
                          <span>Amount: <strong>${parseFloat(ord.order_amount).toFixed(2)}</strong></span>
                          {ord.approx_delivery_date && (
                            <span style={{ color: 'var(--accent-green)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Calendar size={14} /> Approx Delivery: {ord.approx_delivery_date}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
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

                        {/* Step 1 for Seller: Confirm & Place Order */}
                        {isSentToSeller && (
                          <button
                            onClick={() => handleSellerConfirm(ord.order_id)}
                            disabled={actionLoading === ord.order_id}
                            className="btn-primary-block"
                            style={{ width: 'auto', marginTop: 0, padding: '0.55rem 1.1rem' }}
                          >
                            <ShieldCheck size={16} /> {actionLoading === ord.order_id ? 'Confirming...' : 'Confirm & Place Order'}
                          </button>
                        )}

                        {/* Step 2 for Seller: Request Ship to Employee */}
                        {isConfirmed && (
                          <button
                            onClick={() => handleSendShippingRequest(ord.order_id)}
                            disabled={actionLoading === ord.order_id}
                            style={{
                              backgroundColor: 'var(--accent-cyan)',
                              color: '#fff',
                              padding: '0.55rem 1.1rem',
                              borderRadius: 'var(--radius-md)',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}
                          >
                            <Truck size={16} /> {actionLoading === ord.order_id ? 'Requesting...' : 'Request Ship to Employee'}
                          </button>
                        )}

                        {isShipped && (
                          <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}>
                            ORDER SHIPPED (Approx Delivery: {ord.approx_delivery_date || 'Est. 3-5 Days'})
                          </span>
                        )}

                        {isDelivered && (
                          <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem', backgroundColor: '#10b981', color: '#fff' }}>
                            DELIVERED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ordered Items Preview */}
                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      <strong style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>Your Products in this Order:</strong>
                      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                        {ord.items?.map((item, idx) => (
                          <li key={idx}>
                            <strong>{item.product_name}</strong> ({item.brand}) — Qty: {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>My Inventory & Product Catalog</h2>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading seller inventory...</p>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              <Package size={40} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.95rem' }}>No products listed under this seller account.</p>
              <button onClick={handleOpenAdd} className="btn-primary-block" style={{ width: 'auto', display: 'inline-flex', marginTop: '1rem' }}>
                Add First Product
              </button>
            </div>
          ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Preview</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Product Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Brand</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>MRP ($)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Stock Qty</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.product_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <ImageIcon size={20} color="var(--text-secondary)" />
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.product_name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{p.brand}</td>
                    <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-mysql">{p.category_name || 'Category'}</span></td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>${parseFloat(p.mrp).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ fontWeight: 700, color: p.stock_qty < 5 ? '#f87171' : 'var(--text-primary)' }}>
                        {p.stock_qty} units
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge ${p.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button onClick={() => handleOpenEdit(p)} style={{ background: 'transparent', color: 'var(--accent-purple)', marginRight: '0.75rem' }} title="Edit Product">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteProduct(p.product_id)} style={{ background: 'transparent', color: '#f87171' }} title="Delete Product">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              {editingId ? 'Edit Product Details' : 'Add New Product to Catalog'}
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

              <div className="form-group">
                <label className="form-label">Product Image URL / Asset Path</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. /images/headphones.jpg or https://..."
                  value={prodForm.image_url}
                  onChange={(e) => setProdForm({ ...prodForm, image_url: e.target.value })}
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
