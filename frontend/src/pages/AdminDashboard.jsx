import React, { useState, useEffect } from 'react';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import {
  ShieldAlert,
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  Clock,
  Layers,
  CreditCard,
  Star,
  Plus,
  Trash2,
  CheckCircle,
  Database
} from 'lucide-react';

export default function AdminDashboard() {
  const { targetDb } = useDb();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // User Deletion Modal
  const [userToDelete, setUserToDelete] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Category Modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, [targetDb]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, custRes, sellRes, prodRes, catRes, ordRes, payRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/customers'),
        api.get('/admin/sellers'),
        api.get('/products'),
        api.get('/categories'),
        api.get('/orders'),
        api.get('/admin/payments')
      ]);

      setStats(statsRes.data || null);
      setAllUsers(usersRes.data || []);
      setCustomers(custRes.data || []);
      setSellers(sellRes.data || []);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setOrders(ordRes.data || []);
      setPayments(payRes.data || []);
    } catch (err) {
      console.error('Failed to load admin console data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/admin/users/${userToDelete.user_id}`);
      setShowUserModal(false);
      setUserToDelete(null);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { category_name: catName, description: catDesc });
      setShowCatModal(false);
      setCatName('');
      setCatDesc('');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Delete category? Products linked to this category will be affected.')) return;
    try {
      await api.delete(`/categories/${catId}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/products/${prodId}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Admin Header */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-danger">ADMIN CONSOLE</span>
            <span className={`badge badge-${targetDb}`}>DBMS ENGINE: {targetDb.toUpperCase()}</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>E-Commerce DBMS Administration</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Full data management portal mapped to Chen ER diagram specifications.
          </p>
        </div>

        <button onClick={() => fetchAdminData()} className="btn-secondary-outline" style={{ width: 'auto', padding: '0.65rem 1.25rem' }}>
          Sync DBMS Tables
        </button>
      </div>

      {/* Admin Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Customers</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{stats?.totalCustomers || 0}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Sellers</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{stats?.totalSellers || 0}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Products</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>{stats?.totalProducts || 0}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Orders</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa' }}>{stats?.totalOrders || 0}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Orders</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{stats?.pendingOrders || 0}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Revenue</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-green)' }}>${stats?.totalRevenue || 0}</div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview & Orders', icon: Package },
          { id: 'users', label: 'User Management', icon: ShieldAlert },
          { id: 'customers', label: 'Customers Entity', icon: Users },
          { id: 'sellers', label: 'Sellers Entity', icon: Store },
          { id: 'products', label: 'Products Entity', icon: ShoppingBag },
          { id: 'categories', label: 'Categories Entity', icon: Layers },
          { id: 'payments', label: 'Payments Log', icon: CreditCard }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: activeTab === tab.id ? 'var(--accent-purple)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              transition: 'var(--transition-fast)'
            }}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
        
        {/* OVERVIEW & ORDERS TAB */}
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Orders Management Table</h3>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No orders found in database.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.75rem' }}>Order #</th>
                      <th style={{ padding: '0.75rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem' }}>Date</th>
                      <th style={{ padding: '0.75rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem' }}>Payment Status</th>
                      <th style={{ padding: '0.75rem' }}>Order Status</th>
                      <th style={{ padding: '0.75rem' }}>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.order_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{o.order_number}</td>
                        <td style={{ padding: '0.75rem' }}>{o.customer_name}<br/><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.customer_email}</span></td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{o.order_date}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 700 }}>${parseFloat(o.order_amount).toFixed(2)}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className={`badge ${o.payment?.payment_status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                            {o.payment?.payment_mode || 'Card'} ({o.payment?.payment_status || 'Paid'})
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className={`badge ${o.order_status === 'Delivered' ? 'badge-success' : o.order_status === 'Pending' ? 'badge-warning' : 'badge-mysql'}`}>
                            {o.order_status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <select
                            value={o.order_status}
                            onChange={(e) => handleUpdateOrderStatus(o.order_id, e.target.value)}
                            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* USER MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>System Users Directory & Authorization</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Soft-deletes/deactivates accounts to preserve database FK integrity and order history.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem' }}>User ID</th>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem' }}>Account Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(u => (
                    <tr key={u.user_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-purple)' }}>{u.user_id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{u.name}</td>
                      <td style={{ padding: '0.75rem' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'EMPLOYEE' ? 'badge-success' : u.role === 'SELLER' ? 'badge-warning' : 'badge-mysql'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                          {u.is_active ? 'ACTIVE' : 'DEACTIVATED'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        {u.role !== 'ADMIN' && u.is_active && (
                          <button
                            onClick={() => {
                              setUserToDelete(u);
                              setShowUserModal(true);
                            }}
                            className="btn-secondary-outline"
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.8rem',
                              color: '#f87171',
                              borderColor: 'rgba(248, 113, 113, 0.4)',
                              width: 'auto',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CUSTOMERS ENTITY TAB */}
        {activeTab === 'customers' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Customer Records (Derived Age)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem' }}>Customer ID</th>
                    <th style={{ padding: '0.75rem' }}>Full Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Phone</th>
                    <th style={{ padding: '0.75rem' }}>Date of Birth</th>
                    <th style={{ padding: '0.75rem' }}>Age (Derived)</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.customer_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{c.customer_id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{c.first_name} {c.middle_name} {c.last_name}</td>
                      <td style={{ padding: '0.75rem' }}>{c.email}</td>
                      <td style={{ padding: '0.75rem' }}>{c.phone}</td>
                      <td style={{ padding: '0.75rem' }}>{c.date_of_birth}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{c.age} years</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SELLERS ENTITY TAB */}
        {activeTab === 'sellers' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Seller Vendor Records (Derived Total Sales)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem' }}>Seller ID</th>
                    <th style={{ padding: '0.75rem' }}>Store / Company Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Phone</th>
                    <th style={{ padding: '0.75rem' }}>Total Sales (Derived)</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map(s => (
                    <tr key={s.seller_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-amber)' }}>{s.seller_id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{s.name}</td>
                      <td style={{ padding: '0.75rem' }}>{s.email}</td>
                      <td style={{ padding: '0.75rem' }}>{s.phone}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-green)' }}>${s.total_sales?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS ENTITY TAB */}
        {activeTab === 'products' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>System Products Catalog</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem' }}>Product Name</th>
                    <th style={{ padding: '0.75rem' }}>Brand</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>Seller</th>
                    <th style={{ padding: '0.75rem' }}>MRP ($)</th>
                    <th style={{ padding: '0.75rem' }}>Stock</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.product_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{p.product_name}</td>
                      <td style={{ padding: '0.75rem' }}>{p.brand}</td>
                      <td style={{ padding: '0.75rem' }}>{p.category_name}</td>
                      <td style={{ padding: '0.75rem' }}>{p.seller_name}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>${parseFloat(p.mrp).toFixed(2)}</td>
                      <td style={{ padding: '0.75rem' }}>{p.stock_qty}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteProduct(p.product_id)} style={{ background: 'transparent', color: '#f87171' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES ENTITY TAB */}
        {activeTab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Categories Management</h3>
              <button onClick={() => setShowCatModal(true)} className="btn-primary-block" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                <Plus size={16} /> Add Category
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem' }}>Category ID</th>
                    <th style={{ padding: '0.75rem' }}>Category Name</th>
                    <th style={{ padding: '0.75rem' }}>Description</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.category_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-purple)' }}>{c.category_id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{c.category_name}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{c.description}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteCategory(c.category_id)} style={{ background: 'transparent', color: '#f87171' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS LOG TAB */}
        {activeTab === 'payments' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Payments Audit Log</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem' }}>Payment ID</th>
                    <th style={{ padding: '0.75rem' }}>Order ID</th>
                    <th style={{ padding: '0.75rem' }}>Payment Mode</th>
                    <th style={{ padding: '0.75rem' }}>Amount ($)</th>
                    <th style={{ padding: '0.75rem' }}>Payment Date</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.payment_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{p.payment_id}</td>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{p.order_id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.payment_mode}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>${parseFloat(p.amount).toFixed(2)}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{p.date_of_payment}</td>
                      <td style={{ padding: '0.75rem' }}><span className="badge badge-success">{p.payment_status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="modal-overlay" onClick={() => setShowCatModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Product Category</h3>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                ></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowCatModal(false)} className="btn-secondary-outline" style={{ width: 'auto' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-block" style={{ width: 'auto', marginTop: 0 }}>
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showUserModal && userToDelete && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f87171', marginBottom: '0.75rem' }}>
              Are you sure you want to delete this user?
            </h3>

            <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{userToDelete.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email: {userToDelete.email}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Role: <span className="badge badge-mysql">{userToDelete.role}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              This operation will soft-delete / deactivate the account so the user can no longer log in or access the application, while preserving historical orders, payments, and product records.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="btn-secondary-outline"
                style={{ width: 'auto' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
