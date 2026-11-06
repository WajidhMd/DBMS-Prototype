import React, { useRef, useState } from 'react';
import { X, Download, Printer, CheckCircle, Package, Calendar, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InvoiceModal({ order, onClose }) {
  const invoiceRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!order) return null;

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    try {
      setDownloading(true);

      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 297; // A4 size height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${order.order_number || 'ORDER'}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      // Fallback print
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalAmount = parseFloat(order.order_amount || 0);
  const formattedInvoiceNo = `INV-${(order.order_number || '').replace('ORD-', '')}`;
  const approxDelivery = order.approx_delivery_date
    ? new Date(order.approx_delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Pending Dispatch (3-5 Business Days)';

  return (
    <div
      className="modal-overlay animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-glow)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Action Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-input)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--accent-purple)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Official Tax Invoice & Receipt</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="btn-primary-block"
              style={{
                width: 'auto',
                marginTop: 0,
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Download size={16} />
              {downloading ? 'Generating PDF...' : 'Download PDF Invoice'}
            </button>

            <button
              onClick={handlePrint}
              className="btn-secondary-outline"
              style={{
                width: 'auto',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Printer size={16} /> Print
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '0.35rem',
                borderRadius: '50%'
              }}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Content */}
        <div style={{ overflowY: 'auto', padding: '1.5rem' }}>
          <div
            ref={invoiceRef}
            id="invoice-document"
            style={{
              backgroundColor: '#ffffff',
              color: '#1e293b',
              padding: '2.5rem',
              borderRadius: '8px',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Invoice Top Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #6366f1', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#4338ca', margin: 0, tracking: '-0.5px' }}>
                  E-COMMERCE DBMS STORE
                </h1>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem', lineHeight: '1.4' }}>
                  Official Multi-Vendor Online Marketplace<br />
                  100 Tech Plaza, San Jose, CA 95110<br />
                  Support: support@ecommerce-dbms.com
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  Payment Received
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>INVOICE</h2>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>
                  Invoice No: <strong style={{ color: '#0f172a' }}>{formattedInvoiceNo}</strong><br />
                  Order No: <strong style={{ color: '#4338ca' }}>{order.order_number}</strong><br />
                  Date: <strong>{order.order_date || new Date().toISOString().substring(0, 10)}</strong>
                </div>
              </div>
            </div>

            {/* Customer & Address Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <strong style={{ color: '#4338ca', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                  Billed To / Customer:
                </strong>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{order.customer_name || 'Valued Customer'}</div>
                <div style={{ color: '#64748b', marginTop: '0.2rem' }}>Email: {order.customer_email || 'N/A'}</div>
                <div style={{ color: '#64748b', marginTop: '0.2rem' }}>Payment Method: <strong style={{ color: '#0f172a' }}>{order.payment?.payment_mode || 'Paid via Card'}</strong></div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <strong style={{ color: '#4338ca', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                  Shipping Address:
                </strong>
                {order.address ? (
                  <div style={{ color: '#334155', lineHeight: '1.4' }}>
                    <strong>{order.address.street}</strong> {order.address.apartment_no ? `(${order.address.apartment_no})` : ''}<br />
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </div>
                ) : (
                  <div style={{ color: '#64748b' }}>Standard Shipping Address</div>
                )}
              </div>
            </div>

            {/* Order Status & Delivery Estimation Box */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                  Current Order Status
                </span>
                <strong style={{ fontSize: '1.1rem', color: '#15803d' }}>
                  {order.order_status === 'ORDER_PLACED' ? 'Order Placed (Paid)' :
                   order.order_status === 'SENT_TO_SELLER' ? 'Forwarded to Seller' :
                   order.order_status === 'ORDER_CONFIRMED' ? 'Order Confirmed by Seller' :
                   order.order_status === 'SHIPPED' ? 'Order Shipped' :
                   order.order_status === 'DELIVERED' ? 'Delivered' : order.order_status}
                </strong>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                  Approximate Delivery Date
                </span>
                <strong style={{ fontSize: '1.1rem', color: '#047857' }}>
                  {approxDelivery}
                </strong>
              </div>
            </div>

            {/* Purchased Line Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#334155', textAlign: 'left' }}>
                  <th style={{ padding: '0.65rem 0.85rem' }}>#</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Item Description</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Brand</th>
                  <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Unit Price</th>
                  <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => {
                  const unitPrice = parseFloat(item.unit_price || 0);
                  const qty = parseInt(item.quantity || 1);
                  const itemTotal = unitPrice * qty;
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.65rem 0.85rem', color: '#64748b' }}>{index + 1}</td>
                      <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#0f172a' }}>{item.product_name || 'Product Item'}</td>
                      <td style={{ padding: '0.65rem 0.85rem', color: '#64748b' }}>{item.brand || 'N/A'}</td>
                      <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>₹{unitPrice.toFixed(2)}</td>
                      <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 600 }}>{qty}</td>
                      <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{itemTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Total Calculation Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
              <div style={{ width: '280px', backgroundColor: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>Items Subtotal:</span>
                  <strong>₹{totalAmount.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>Standard Shipping:</span>
                  <strong style={{ color: '#16a34a' }}>FREE</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>Estimated Tax:</span>
                  <span>₹0.00 (Included)</span>
                </div>
                <div style={{
                  display: 'flex',
                  justify: 'space-between',
                  borderTop: '2px solid #6366f1',
                  paddingTop: '0.65rem',
                  marginTop: '0.4rem',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#4338ca'
                }}>
                  <span>Total Paid:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Invoice Footer Stamp & Notes */}
            <div style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1.25rem',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem',
              color: '#94a3b8'
            }}>
              <div>
                <p style={{ margin: 0 }}>This is a computer-generated tax invoice for your order.</p>
                <p style={{ margin: '0.2rem 0 0 0' }}>Thank you for shopping with E-Commerce DBMS!</p>
              </div>

              <div style={{ textAlign: 'right', borderLeft: '2px solid #cbd5e1', paddingLeft: '1rem' }}>
                <strong style={{ color: '#475569', display: 'block' }}>Verified Payment Status</strong>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ FULLY SETTLED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
