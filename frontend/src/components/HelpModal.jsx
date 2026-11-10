import React from 'react';
import { Database, ShieldCheck, Truck, RotateCcw, Users, Layers, X, Check } from 'lucide-react';

export default function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-on-brand)' }}>
              <Database size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>PACIFIC DBMS Guide</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Multi-Database Architecture & Features</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: 'var(--color-text-secondary)', fontSize: '1.4rem', cursor: 'pointer', padding: '0.25rem', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
          {/* Target DB Switching */}
          <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
            <h4 style={{ color: 'var(--color-text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Layers size={18} color="var(--color-primary)" /> Dynamic Database Switching
            </h4>
            <p>
              Use the <strong>PostgreSQL</strong> / <strong>MongoDB</strong> toggle in the top bar or sidebar to dynamically switch the backend database engine. Every API request attaches the active database type in the <code>x-database-type</code> header without restarting servers.
            </p>
          </div>

          {/* User Roles */}
          <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
            <h4 style={{ color: 'var(--color-text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Users size={18} color="var(--color-primary)" /> 4 Distinct Role Portals
            </h4>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>CUSTOMER:</strong> Browse catalog, add to cart, checkout, live visual order timeline, and product returns.</li>
              <li><strong>SELLER:</strong> Manage product inventory, restock quantities, and process return requests.</li>
              <li><strong>EMPLOYEE:</strong> Verify shipments, dispatch logistics, and update order milestones.</li>
              <li><strong>ADMIN:</strong> Moderate reviews, oversee cross-database collections, and manage user accounts.</li>
            </ul>
          </div>

          {/* Test Accounts */}
          <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
            <h4 style={{ color: 'var(--color-text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--color-success)" /> Pre-Seeded Sample Accounts
            </h4>
            <p style={{ marginBottom: '0.5rem' }}>All pre-seeded test accounts use the password: <code>password123</code></p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ padding: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>CUSTOMER</span>
                <div style={{ color: 'var(--color-text)', fontWeight: 600, marginTop: '0.2rem' }}>john.doe@example.com</div>
              </div>
              <div style={{ padding: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>SELLER</span>
                <div style={{ color: 'var(--color-text)', fontWeight: 600, marginTop: '0.2rem' }}>techworld@seller.com</div>
              </div>
              <div style={{ padding: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>EMPLOYEE</span>
                <div style={{ color: 'var(--color-text)', fontWeight: 600, marginTop: '0.2rem' }}>employee@ecommerce.com</div>
              </div>
              <div style={{ padding: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>ADMIN</span>
                <div style={{ color: 'var(--color-text)', fontWeight: 600, marginTop: '0.2rem' }}>admin@ecommerce.com</div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-primary-block"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            Got it, continue exploring PACIFIC
          </button>
        </div>
      </div>
    </div>
  );
}
