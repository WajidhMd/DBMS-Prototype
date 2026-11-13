import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CreditCard, QrCode, Smartphone, Building, CheckCircle2, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function RazorpayModal({
  isOpen,
  onClose,
  amount,
  orderNumber,
  customerEmail,
  customerPhone,
  onSuccess
}) {
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'card' | 'upi' | 'netbanking'
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [success, setSuccess] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [cardName, setCardName] = useState('PACIFIC VIP CLIENT');

  // UPI state
  const [upiId, setUpiId] = useState('pacific.customer@oksbi');
  const [selectedBank, setSelectedBank] = useState('HDFC');

  if (!isOpen) return null;

  const handleSimulatePayment = (paymentMethodName) => {
    setProcessing(true);
    setProcessStep('Connecting to Razorpay secure banking gateway...');

    setTimeout(() => {
      setProcessStep(`Authorizing transaction via ${paymentMethodName}...`);
    }, 900);

    setTimeout(() => {
      setProcessStep('Verifying 256-bit SSL transaction token...');
    }, 1800);

    setTimeout(() => {
      setProcessStep('Payment Authorized! Generating receipt...');
      setSuccess(true);
      setProcessing(false);

      const paymentId = `pay_test_${Date.now()}`;
      const razorpayOrderId = `order_test_${Date.now()}`;
      const signature = `rzp_sig_${Math.random().toString(36).substring(2, 15)}`;

      setTimeout(() => {
        onSuccess({
          razorpay_payment_id: paymentId,
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: signature,
          payment_method: paymentMethodName
        });
      }, 800);
    }, 2600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={!processing ? onClose : undefined}
    >
      <div
        style={{
          backgroundColor: '#0c1017',
          color: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '540px',
          border: '1px solid #1f293d',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(12, 102, 228, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #091e3a 0%, #0d2952 100%)',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #1b3a6b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span
                style={{
                  background: '#0c66e4',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  letterSpacing: '0.05em'
                }}
              >
                Razorpay
              </span>
              <span style={{ fontSize: '0.75rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ShieldCheck size={13} color="#60a5fa" /> Test Mode Gateway
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
              PACIFIC LUXURY STORE
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Amount Payable</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#facc15' }}>
                ₹{Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            {!processing && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#94a3b8',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Processing State */}
        {processing || success ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            {success ? (
              <div className="animate-fade-in">
                <CheckCircle2 size={56} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#22c55e', margin: '0 0 0.5rem' }}>
                  Payment Verified Successfully!
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  {processStep}
                </p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <Loader2 size={48} color="#0c66e4" className="animate-spin" style={{ margin: '0 auto 1.25rem', animation: 'spin 1s linear infinite' }} />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 0.5rem' }}>
                  Securing Transaction
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                  {processStep}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <Lock size={12} /> 256-bit Bank Grade Encryption • Do not refresh or press back
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', minHeight: '340px' }}>
            {/* Sidebar Navigation */}
            <div style={{ background: '#080c14', borderRight: '1px solid #1f293d', padding: '0.75rem 0.5rem' }}>
              {[
                { id: 'qr', label: 'UPI QR Code', icon: QrCode },
                { id: 'card', label: 'Cards', icon: CreditCard },
                { id: 'upi', label: 'UPI ID / Apps', icon: Smartphone },
                { id: 'netbanking', label: 'NetBanking', icon: Building }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.75rem 0.65rem',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(12, 102, 228, 0.15)' : 'transparent',
                      color: isSelected ? '#60a5fa' : '#94a3b8',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.82rem',
                      border: isSelected ? '1px solid rgba(12, 102, 228, 0.3)' : '1px solid transparent',
                      cursor: 'pointer',
                      marginBottom: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div style={{ padding: '1.25rem 1.5rem', background: '#0c1017' }}>
              {/* Tab 1: UPI QR */}
              {activeTab === 'qr' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.75rem' }}>
                    Scan QR with any UPI App
                  </div>

                  <div
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '1rem',
                      width: '160px',
                      height: '160px',
                      margin: '0 auto 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                    }}
                  >
                    {/* High-fidelity stylized SVG QR code */}
                    <svg viewBox="0 0 100 100" width="130" height="130" fill="#0c1017">
                      <rect width="30" height="30" x="5" y="5" />
                      <rect width="18" height="18" x="11" y="11" fill="#fff" />
                      <rect width="10" height="10" x="15" y="15" />
                      
                      <rect width="30" height="30" x="65" y="5" />
                      <rect width="18" height="18" x="71" y="11" fill="#fff" />
                      <rect width="10" height="10" x="75" y="15" />

                      <rect width="30" height="30" x="5" y="65" />
                      <rect width="18" height="18" x="11" y="71" fill="#fff" />
                      <rect width="10" height="10" x="15" y="75" />

                      <rect width="6" height="6" x="42" y="15" />
                      <rect width="6" height="6" x="52" y="25" />
                      <rect width="6" height="6" x="42" y="35" />
                      <rect width="6" height="6" x="52" y="45" />
                      <rect width="6" height="6" x="42" y="55" />
                      <rect width="6" height="6" x="52" y="65" />
                      <rect width="6" height="6" x="75" y="45" />
                      <rect width="6" height="6" x="85" y="55" />
                      <rect width="6" height="6" x="65" y="75" />
                      <rect width="6" height="6" x="85" y="85" />
                    </svg>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.72rem', background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#cbd5e1' }}>GPay</span>
                    <span style={{ fontSize: '0.72rem', background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#cbd5e1' }}>PhonePe</span>
                    <span style={{ fontSize: '0.72rem', background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#cbd5e1' }}>Paytm</span>
                    <span style={{ fontSize: '0.72rem', background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#cbd5e1' }}>BHIM</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment('UPI QR Code')}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #0c66e4 0%, #0052cc 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>Simulate UPI QR App Approval</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* Tab 2: Cards */}
              {activeTab === 'card' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>Card Details</span>
                    <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>✓ Razorpay Test Card Prefilled</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#161e2e',
                          border: '1px solid #283548',
                          color: '#fff',
                          borderRadius: '6px',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.85rem',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          style={{
                            width: '100%',
                            background: '#161e2e',
                            border: '1px solid #283548',
                            color: '#fff',
                            borderRadius: '6px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                          style={{
                            width: '100%',
                            background: '#161e2e',
                            border: '1px solid #283548',
                            color: '#fff',
                            borderRadius: '6px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#161e2e',
                          border: '1px solid #283548',
                          color: '#fff',
                          borderRadius: '6px',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment('Razorpay Test Card (Visa)')}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #0c66e4 0%, #0052cc 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>Pay ₹{Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* Tab 3: UPI ID */}
              {activeTab === 'upi' && (
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.5rem' }}>
                    Pay via UPI ID / VPA
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    Enter your Virtual Payment Address (e.g. mobile@upi)
                  </p>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      style={{
                        width: '100%',
                        background: '#161e2e',
                        border: '1px solid #283548',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '0.65rem 0.75rem',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(`UPI ID (${upiId})`)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #0c66e4 0%, #0052cc 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>Authorize & Pay via UPI</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* Tab 4: NetBanking */}
              {activeTab === 'netbanking' && (
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.75rem' }}>
                    Select Popular Bank
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.25rem' }}>
                    {[
                      { code: 'HDFC', name: 'HDFC Bank' },
                      { code: 'ICICI', name: 'ICICI Bank' },
                      { code: 'SBI', name: 'State Bank of India' },
                      { code: 'AXIS', name: 'Axis Bank' }
                    ].map((bank) => (
                      <button
                        key={bank.code}
                        type="button"
                        onClick={() => setSelectedBank(bank.code)}
                        style={{
                          background: selectedBank === bank.code ? 'rgba(12, 102, 228, 0.2)' : '#161e2e',
                          border: `1px solid ${selectedBank === bank.code ? '#0c66e4' : '#283548'}`,
                          color: selectedBank === bank.code ? '#60a5fa' : '#cbd5e1',
                          padding: '0.65rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {bank.name}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(`NetBanking (${selectedBank})`)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #0c66e4 0%, #0052cc 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>Pay via {selectedBank} NetBanking</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            background: '#070a10',
            borderTop: '1px solid #161e2e',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.72rem',
            color: '#64748b'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Lock size={12} color="#22c55e" /> PCI-DSS Level 1 Certified
          </div>
          <div>PACIFIC Multi-Engine DBMS Integration</div>
        </div>
      </div>
    </div>
  );
}
