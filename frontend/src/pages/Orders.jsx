import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import { Package, Clock, MapPin, CreditCard, ChevronDown, ChevronUp, FileText, Calendar, Truck, CheckCircle } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

export default function Orders() {
  const { user, role } = useAuth();
  const { targetDb } = useDb();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
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
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status) => {
    const upper = (status || '').toUpperCase();
    if (upper === 'ORDER_PLACED' || upper === 'PENDING_EMPLOYEE') {
      return <span className="badge badge-warning">Order Placed</span>;
    }
    if (upper === 'SENT_TO_SELLER') {
      return <span className="badge badge-mysql">Forwarded to Seller</span>;
    }
    if (upper === 'ORDER_CONFIRMED') {
      return <span className="badge badge-cyan" style={{ backgroundColor: 'var(--accent-purple)', color: '#fff' }}>Order Confirmed by Seller</span>;
    }
    if (upper === 'SHIPPED') {
      return <span className="badge badge-success">Order Shipped</span>;
    }
    if (upper === 'DELIVERED') {
      return <span className="badge badge-success" style={{ backgroundColor: '#10b981', color: '#fff' }}>Delivered</span>;
    }
    return <span className="badge badge-mysql">{status}</span>;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className={`badge badge-${targetDb}`}>{targetDb.toUpperCase()} RECORDS</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>M:N Junction: order_item</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Order Management & History</h1>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>Loading orders list...</p>
      ) : orders.length === 0 ? (
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(ord => {
            const isExpanded = expandedId === ord.order_id;
            return (
              <div
                key={ord.order_id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--accent-purple)' }}>{ord.order_number}</strong>
                      {getStatusBadge(ord.order_status)}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span>Ordered on: <strong>{ord.order_date}</strong></span>
                      {ord.shipping_date && <span>Shipped: <strong>{ord.shipping_date}</strong></span>}
                      {ord.approx_delivery_date && (
                        <span style={{ color: 'var(--accent-green)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={14} /> Approx Delivery: {ord.approx_delivery_date}
                        </span>
                      )}
                      {role !== 'CUSTOMER' && <span>Customer: <strong>{ord.customer_name}</strong></span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Order Amount</span>
                      <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>${parseFloat(ord.order_amount).toFixed(2)}</strong>
                    </div>

                    {/* View/Download Invoice Button */}
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
                      title="View & Download PDF Invoice"
                    >
                      <FileText size={15} /> Invoice
                    </button>

                    <button
                      onClick={() => toggleExpand(ord.order_id)}
                      className="btn-secondary-outline"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {/* Expanded Order Items Details */}
                {isExpanded && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }} className="animate-fade-in">
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Ordered Products (order_item)</h4>

                    <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '1rem' }}>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                      {/* Shipping Address */}
                      <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
                        <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Shipping Address (ships to):</strong>
                        <p style={{ color: 'var(--text-secondary)' }}>
                          {ord.address ? `${ord.address.street}, ${ord.address.apartment_no ? ord.address.apartment_no + ', ' : ''}${ord.address.city}, ${ord.address.state} - ${ord.address.pincode}` : 'Standard Address'}
                        </p>
                      </div>

                      {/* Payment Information */}
                      <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
                        <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Payment Info (paid by):</strong>
                        <p style={{ color: 'var(--text-secondary)' }}>
                          Mode: <strong>{ord.payment?.payment_mode || 'Card'}</strong> • Status: <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{ord.payment?.payment_status || 'Completed'}</span>
                        </p>
                        {ord.approx_delivery_date && (
                          <div style={{ marginTop: '0.5rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                            Approximate Delivery Date: <strong>{ord.approx_delivery_date}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order History Timeline */}
                    {ord.history && ord.history.length > 0 && (
                      <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginTop: '1rem' }}>
                        <strong style={{ display: 'block', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>Order Lifecycle & Audit Log:</strong>
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
          })}
        </div>
      )}

      {/* Invoice View & Download Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
