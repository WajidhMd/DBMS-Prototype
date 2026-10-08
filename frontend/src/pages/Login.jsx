import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import { Database, Lock, Mail, Eye, EyeOff, LogIn, UserPlus, Info, Check, ShieldCheck } from 'lucide-react';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const { targetDb, setTargetDb } = useDb();
  const navigate = useNavigate();

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
        navigate('/customer/dashboard');
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
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Database size={30} />
          </div>
          <h1 className="auth-title">E-Commerce DBMS Portal</h1>
          <p className="auth-subtitle">Database Management Systems Project</p>
        </div>

        {/* Database Selector Pill Grid */}
        <div className="target-db-section">
          <label className="target-db-label">TARGET DATABASE</label>
          <div className="db-selector-grid">
            <button
              type="button"
              className={`db-select-btn ${targetDb === 'mysql' ? 'selected-mysql' : ''}`}
              onClick={() => setTargetDb('mysql')}
            >
              {targetDb === 'mysql' && <Check size={14} />} MySQL
            </button>

            <button
              type="button"
              className={`db-select-btn ${targetDb === 'postgresql' ? 'selected-postgresql' : ''}`}
              onClick={() => setTargetDb('postgresql')}
            >
              {targetDb === 'postgresql' && <Check size={14} />} PostgreSQL
            </button>

            <button
              type="button"
              className={`db-select-btn ${targetDb === 'mongodb' ? 'selected-mongodb' : ''}`}
              onClick={() => setTargetDb('mongodb')}
            >
              {targetDb === 'mongodb' && <Check size={14} />} MongoDB
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && <div className="error-banner">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username / Email</label>
            <div className="input-container">
              <input
                type="email"
                className="form-input"
                placeholder="Enter email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary-block" disabled={loading}>
            <LogIn size={18} /> {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>

        <hr className="auth-divider" />

        <div className="auth-secondary-actions">
          <Link to="/register" className="btn-secondary-outline">
            <UserPlus size={16} /> Create New Account
          </Link>

          <button type="button" onClick={openSampleAccountsModal} className="btn-sample-accounts">
            <Info size={16} /> View Sample Accounts
          </button>
        </div>
      </div>

      {/* Sample Accounts Modal */}
      {showSampleModal && (
        <div className="modal-overlay" onClick={() => setShowSampleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck color="var(--accent-cyan)" size={22} /> Pre-configured DBMS Seed Accounts
              </h3>
              <button
                onClick={() => setShowSampleModal(false)}
                style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Click any sample account below to quickly autofill credentials for testing with the <strong>{targetDb.toUpperCase()}</strong> database engine.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
              {sampleAccounts.map((acc, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSampleAccount(acc)}
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-purple)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className={`badge ${acc.role === 'ADMIN' ? 'badge-danger' : acc.role === 'SELLER' ? 'badge-warning' : 'badge-success'}`}>
                        {acc.role}
                      </span>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{acc.email}</strong>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{acc.description}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Password: <code>{acc.password}</code>
                    </div>
                  </div>
                  <button
                    style={{
                      backgroundColor: 'var(--accent-purple)',
                      color: '#fff',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 600
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
