import React from 'react';
import { useDb } from '../context/DbContext';
import { Database, Server } from 'lucide-react';

export default function Footer() {
  const { targetDb } = useDb();

  return (
    <footer style={{
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '1.25rem 1.5rem',
      marginTop: 'auto',
      fontSize: '0.82rem',
      color: 'var(--color-text-secondary)',
      transition: 'background var(--transition-fast), border-color var(--transition-fast)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <strong style={{ color: 'var(--color-text)', fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
            <img src="/images/pacific_logo.png" alt="PACIFIC" style={{ height: "26px", width: "auto", objectFit: "contain", verticalAlign: "middle" }} />
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Server size={14} color={targetDb === 'postgresql' ? 'var(--color-info)' : 'var(--color-success)'} />
            <span>Active DB Engine: <strong style={{ color: 'var(--color-text)', textTransform: 'uppercase' }}>{targetDb}</strong></span>
          </div>
          <span>•</span>
          <span>© 2026 PACIFIC E-Commerce</span>
        </div>
      </div>
    </footer>
  );
}
