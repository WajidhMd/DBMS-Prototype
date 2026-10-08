import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { User, ShieldCheck, Database, Calendar, Phone, Mail } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { targetDb } = useDb();

  const profile = user?.profile;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '650px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.25rem',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '1rem'
          }}>
            <User size={36} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Account Profile</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span className={`badge badge-${targetDb}`}>{targetDb.toUpperCase()} ENGINE</span>
            <span className="badge badge-success">{user?.role} ROLE</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail color="var(--accent-purple)" size={20} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Email Address</span>
              <strong style={{ fontSize: '0.95rem' }}>{user?.email}</strong>
            </div>
          </div>

          {user?.role === 'CUSTOMER' && (
            <>
              <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User color="var(--accent-cyan)" size={20} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Full Name</span>
                  <strong style={{ fontSize: '0.95rem' }}>{profile?.first_name} {profile?.middle_name} {profile?.last_name}</strong>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone color="var(--accent-green)" size={20} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Phone Number</span>
                  <strong style={{ fontSize: '0.95rem' }}>{profile?.phone}</strong>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar color="var(--accent-amber)" size={20} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Date of Birth & Age (Derived)</span>
                  <strong style={{ fontSize: '0.95rem' }}>{profile?.date_of_birth} ({profile?.age} years old)</strong>
                </div>
              </div>
            </>
          )}

          {user?.role === 'SELLER' && (
            <>
              <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck color="var(--accent-cyan)" size={20} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Store Name</span>
                  <strong style={{ fontSize: '0.95rem' }}>{profile?.name}</strong>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone color="var(--accent-green)" size={20} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Seller Phone</span>
                  <strong style={{ fontSize: '0.95rem' }}>{profile?.phone}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
