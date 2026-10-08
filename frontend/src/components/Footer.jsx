import React from 'react';
import { useDb } from '../context/DbContext';
import { Database, Server } from 'lucide-react';

export default function Footer() {
  const { targetDb } = useDb();

  return (
    <footer style={{
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      padding: '1.5rem 1.5rem',
      marginTop: 'auto',
      fontSize: '0.85rem',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={18} color="var(--accent-purple)" />
          <span>E-Commerce Management System (Chen ER Diagram Spec)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Server size={14} color="#10b981" />
            <span>Target Engine: <strong style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>{targetDb}</strong></span>
          </div>
          <span>•</span>
          <span>Database Management Systems Project</span>
        </div>
      </div>
    </footer>
  );
}
