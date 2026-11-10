import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  UserCheck,
  ArrowLeft,
  CheckCircle,
  Database,
  Layers,
  Check
} from 'lucide-react';
import './Login.css';

export default function Register() {
  const { register, login } = useAuth();
  const { targetDb, setTargetDb } = useDb();
  const { syncGuestCart } = useCart();
  const { syncGuestWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || location.state?.from?.pathname || null;

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    password: '',
    confirm_password: '',
    account_type: 'Customer',
    seller_name: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Field Validations
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone ||
      !formData.date_of_birth ||
      !formData.password
    ) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await register(formData, targetDb);

      if (formData.account_type === 'Customer') {
        setSuccessMsg(`Registration successful! Setting up session in ${targetDb.toUpperCase()}...`);
        try {
          await login(formData.email, formData.password, targetDb);
          await syncGuestCart();
          await syncGuestWishlist();

          setTimeout(() => {
            if (redirectUrl) {
              navigate(redirectUrl);
            } else {
              navigate('/customer/dashboard');
            }
          }, 900);
          return;
        } catch (loginErr) {
          console.error('Auto login error:', loginErr);
        }
      }

      setSuccessMsg(`Registration successful in ${targetDb.toUpperCase()} database! Redirecting to login...`);
      setTimeout(() => {
        navigate(redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jmart-auth-page">
      <div className="jmart-auth-window" style={{ maxWidth: '680px', gridTemplateColumns: '1fr' }}>
        <div className="auth-form-panel" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              to={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: '#9ca3af',
                textDecoration: 'none'
              }}
            >
              <ArrowLeft size={16} /> Back to Sign In
            </Link>

            {/* Target DB Switcher */}
            <div style={{ display: 'flex', gap: '0.35rem', background: '#1f2736', padding: '3px', borderRadius: '9999px' }}>
              <button
                type="button"
                onClick={() => setTargetDb('postgresql')}
                style={{
                  background: targetDb === 'postgresql' ? '#2563eb' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                PostgreSQL
              </button>
              <button
                type="button"
                onClick={() => setTargetDb('mongodb')}
                style={{
                  background: targetDb === 'mongodb' ? '#059669' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                MongoDB
              </button>
            </div>
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <Link to="/" className="auth-logo-wrap" style={{ textDecoration: 'none', display: 'inline-block', margin: '0 auto 0.75rem auto' }} title="PACIFIC Home">
              <img src="/images/pacific_logo.png" alt="PACIFIC" style={{ height: '42px', width: 'auto', objectFit: 'contain', display: 'block' }} />
            </Link>
            <h2 className="auth-welcome-title" style={{ fontSize: '1.45rem' }}>Create PACIFIC Account</h2>
            <p className="auth-welcome-subtitle" style={{ fontSize: '0.82rem' }}>
              Target Database: <strong style={{ color: 'var(--color-primary)' }}>{targetDb.toUpperCase()}</strong>
            </p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}
          {successMsg && (
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle size={18} /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-input-form">
            {/* Account Role Type */}
            <div
              style={{
                backgroundColor: '#1f2736',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <label className="field-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                Account Role Type
              </label>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', color: '#e2e8f0' }}>
                  <input
                    type="radio"
                    name="account_type"
                    value="Customer"
                    checked={formData.account_type === 'Customer'}
                    onChange={handleChange}
                  />
                  <span>Customer (Buyer)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', color: '#e2e8f0' }}>
                  <input
                    type="radio"
                    name="account_type"
                    value="Seller"
                    checked={formData.account_type === 'Seller'}
                    onChange={handleChange}
                  />
                  <span>Seller (Vendor)</span>
                </label>
              </div>
            </div>

            {formData.account_type === 'Seller' && (
              <div className="form-field-group">
                <label className="field-label">Store / Company Name *</label>
                <input
                  type="text"
                  name="seller_name"
                  className="auth-text-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="e.g. Apex Electronics Ltd"
                  value={formData.seller_name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Name Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              <div className="form-field-group">
                <label className="field-label">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  className="auth-text-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Middle Name</label>
                <input
                  type="text"
                  name="middle_name"
                  className="auth-text-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Robert"
                  value={formData.middle_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  className="auth-text-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-field-group">
                <label className="field-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="auth-text-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  className="auth-text-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="+1-555-0192"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* DOB */}
            <div className="form-field-group">
              <label className="field-label">Date of Birth *</label>
              <input
                type="date"
                name="date_of_birth"
                className="auth-text-input"
                style={{ paddingLeft: '1rem' }}
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-field-group">
                <label className="field-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="auth-text-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirm_password"
                  className="auth-text-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Repeat password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-jmart-submit" disabled={loading} style={{ marginTop: '0.75rem' }}>
              {loading ? 'Creating Account...' : 'Register & Join PACIFIC'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
