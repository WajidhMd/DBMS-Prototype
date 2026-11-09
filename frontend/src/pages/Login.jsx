import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Info,
  Check,
  ShieldCheck,
  Database,
  Layers,
  Truck,
  RotateCcw,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const { targetDb, setTargetDb } = useDb();
  const { theme, toggleTheme } = useTheme();
  const { syncGuestCart } = useCart();
  const { syncGuestWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || location.state?.from?.pathname || null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample Accounts Modal
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [sampleAccounts, setSampleAccounts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password, targetDb);
      const role = res.user.role;

      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'EMPLOYEE') {
        navigate('/employee/dashboard');
      } else if (role === 'SELLER') {
        navigate('/seller/dashboard');
      } else {
        // Customer: synchronize guest cart and guest wishlist
        await syncGuestCart();
        await syncGuestWishlist();

        if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/customer/dashboard');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const openSampleAccountsModal = async () => {
    try {
      const res = await api.get('/auth/sample-accounts');
      setSampleAccounts(res.data.accounts || []);
      setShowSampleModal(true);
    } catch (err) {
      setError('Could not load sample accounts.');
    }
  };

  const handleSelectSampleAccount = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setShowSampleModal(false);
  };

  return (
    <div className="jmart-auth-page">
      <div className="jmart-auth-window">
        {/* Left Showcase Branding Panel */}
        <div className="auth-brand-panel">
          {/* Logo */}
          <div className="auth-logo-wrap">
            <div className="logo-main">
              <span className="logo-text">jmart</span>
              <span className="logo-domain">.in</span>
            </div>
            <svg className="jmart-smile-curve" viewBox="0 0 100 24" width="85" height="18">
              <path d="M 6 6 Q 50 25 90 7" fill="transparent" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 84 4 L 92 7 L 85 13 Z" fill="var(--color-primary)" stroke="var(--color-primary)" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="auth-brand-tagline">
            Multi-Database E-Commerce Management System
          </p>

          {/* Mini Promotional Banner */}
          <div className="auth-hero-card">
            <div className="auth-hero-text">
              <h4>Free Delivery!</h4>
              <p>Get instant next-day delivery on all student and lab demonstration orders.</p>
            </div>
            <svg className="auth-cursor-arrow" viewBox="0 0 40 40" width="46" height="46">
              <path d="M 6 6 L 16 34 L 21 21 L 34 16 Z" fill="rgba(255, 255, 255, 0.2)" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
            </svg>
          </div>

          {/* Key Architectural Highlights */}
          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="feature-icon-box">
                <Database size={16} />
              </div>
              <div className="feature-text">
                <strong>Dual-Engine DBMS</strong>
                <span>Dynamic zero-downtime switching between PostgreSQL & MongoDB.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-icon-box">
                <Truck size={16} />
              </div>
              <div className="feature-text">
                <strong>Live Visual Tracking</strong>
                <span>Milestone order progression and product return timeline.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-icon-box">
                <ShieldCheck size={16} />
              </div>
              <div className="feature-text">
                <strong>Multi-Role Portals</strong>
                <span>Dedicated interfaces for Customer, Seller, Employee, and Admin.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="auth-form-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div className="auth-form-header" style={{ marginBottom: 0 }}>
              <h2 className="auth-welcome-title">Welcome Back</h2>
              <p className="auth-welcome-subtitle">Sign in to your JMART account</p>
            </div>
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '0.45rem',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Target Database Selector Pills */}
          <div className="target-db-box">
            <div className="target-db-header">
              <Layers size={13} />
              <span>TARGET DATABASE ENGINE</span>
            </div>
            <div className="db-toggle-grid">
              <button
                type="button"
                className={`auth-db-btn ${targetDb === 'postgresql' ? 'active-pg' : ''}`}
                onClick={() => setTargetDb('postgresql')}
              >
                {targetDb === 'postgresql' && <Check size={14} />} PostgreSQL
              </button>

              <button
                type="button"
                className={`auth-db-btn ${targetDb === 'mongodb' ? 'active-mongo' : ''}`}
                onClick={() => setTargetDb('mongodb')}
              >
                {targetDb === 'mongodb' && <Check size={14} />} MongoDB
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && <div className="auth-error-banner">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-input-form">
            <div className="form-field-group">
              <label className="field-label">Username / Email</label>
              <div className="field-input-wrap">
                <Mail size={16} className="field-icon" />
                <input
                  type="email"
                  className="auth-text-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Password</label>
              <div className="field-input-wrap">
                <Lock size={16} className="field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-text-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-reveal-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-jmart-submit" disabled={loading}>
              <LogIn size={18} /> {loading ? 'Authenticating...' : 'Sign In to JMART'}
            </button>
          </form>

          <div className="auth-divider-line">
            <span>or explore with demo credentials</span>
          </div>

          {/* Secondary Actions */}
          <div className="auth-aux-actions">
            <button
              type="button"
              onClick={openSampleAccountsModal}
              className="btn-aux-sample-accounts"
            >
              <Info size={16} /> View Pre-configured Sample Accounts
            </button>

            <Link to={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register'} className="btn-aux-register">
              <UserPlus size={16} /> Create New Account
            </Link>
          </div>
        </div>
      </div>

      {/* Pre-configured DBMS Sample Accounts Modal */}
      {showSampleModal && (
        <div className="modal-overlay" onClick={() => setShowSampleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
                <ShieldCheck color="var(--color-primary)" size={22} /> Pre-configured DBMS Seed Accounts
              </h3>
              <button
                onClick={() => setShowSampleModal(false)}
                style={{ background: 'transparent', color: 'var(--color-text-secondary)', fontSize: '1.3rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Click any sample account below to quickly autofill credentials for testing with the <strong>{targetDb.toUpperCase()}</strong> database engine.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
              {sampleAccounts.map((acc, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSampleAccount(acc)}
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-card)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className={`badge ${acc.role === 'ADMIN' ? 'badge-danger' : acc.role === 'SELLER' ? 'badge-warning' : acc.role === 'EMPLOYEE' ? 'badge-cyan' : 'badge-success'}`}>
                        {acc.role}
                      </span>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--color-text)' }}>{acc.email}</strong>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{acc.description}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                      Password: <code>{acc.password}</code>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-text-on-brand)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-button)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
