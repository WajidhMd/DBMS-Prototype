import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { Database, User, Mail, Phone, Calendar, Lock, UserCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import './Login.css';

export default function Register() {
  const { register } = useAuth();
  const { targetDb } = useDb();
  const navigate = useNavigate();

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
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone || !formData.date_of_birth || !formData.password) {
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
      const res = await register(formData, targetDb);
      setSuccessMsg(`Registration successful in ${targetDb.toUpperCase()} database! Redirecting to login...`);

      setTimeout(() => {
        navigate('/login');
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '620px' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>

        <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
          <div className="auth-logo-badge">
            <UserCheck size={30} />
          </div>
          <h1 className="auth-title">Create New Account</h1>
          <p className="auth-subtitle">Target Database: <strong style={{ color: 'var(--accent-purple)', textTransform: 'uppercase' }}>{targetDb}</strong></p>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {successMsg && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Account Type Selection */}
          <div className="form-group" style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>Account Role Type</label>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="account_type"
                  value="Customer"
                  checked={formData.account_type === 'Customer'}
                  onChange={handleChange}
                />
                <strong>Customer</strong> (Default)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="account_type"
                  value="Seller"
                  checked={formData.account_type === 'Seller'}
                  onChange={handleChange}
                />
                <strong>Seller / Vendor</strong>
              </label>
            </div>
          </div>

          {formData.account_type === 'Seller' && (
            <div className="form-group">
              <label className="form-label">Store / Company Name *</label>
              <input
                type="text"
                name="seller_name"
                className="form-input"
                placeholder="e.g. Apex Electronics Ltd"
                value={formData.seller_name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Name Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="first_name"
                className="form-input"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Middle Name</label>
              <input
                type="text"
                name="middle_name"
                className="form-input"
                placeholder="Robert"
                value={formData.middle_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="last_name"
                className="form-input"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Contact Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                placeholder="+1-555-0192"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* DOB Row */}
          <div className="form-group">
            <label className="form-label">Date of Birth *</label>
            <input
              type="date"
              name="date_of_birth"
              className="form-input"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirm_password"
                className="form-input"
                placeholder="Repeat password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary-block" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Processing Registration...' : 'Register & Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
