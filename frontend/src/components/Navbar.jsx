import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import {
  Database,
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Layers,
  MapPin,
  Star,
  Users,
  CreditCard,
  ShieldAlert
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import './Navbar.css';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { targetDb, setTargetDb } = useDb();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (role === 'CUSTOMER') {
      fetchCartCount();
    }
  }, [role, location.pathname, targetDb]);

  const fetchCartCount = async () => {
    try {
      const res = await api.get('/cart');
      setCartCount(res.data.items_total || 0);
    } catch (err) {
      setCartCount(0);
    }
  };

  const handleDbChange = (db) => {
    setTargetDb(db);
    // Refresh page or trigger re-fetch
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Database size={22} />
          </div>
          <div className="brand-text">
            <h1>E-Commerce DBMS</h1>
            <span>Database Management Portal</span>
          </div>
        </Link>

        {/* Database Selector Pills (PostgreSQL & MongoDB only) */}
        <div className="db-pill-selector" title="Active Target Database">
          <button
            className={`db-pill-btn ${targetDb === 'postgresql' ? 'active-postgresql' : ''}`}
            onClick={() => handleDbChange('postgresql')}
          >
            PostgreSQL
          </button>
          <button
            className={`db-pill-btn ${targetDb === 'mongodb' ? 'active-mongodb' : ''}`}
            onClick={() => handleDbChange('mongodb')}
          >
            MongoDB
          </button>
        </div>

        {/* Navigation Links based on user role */}
        <ul className="navbar-links">
          {!user ? (
            <>
              <li>
                <Link to="/products" className={`nav-item ${location.pathname === '/products' ? 'active' : ''}`}>
                  <ShoppingBag size={16} /> Products
                </Link>
              </li>
              <li>
                <Link to="/login" className="nav-item">
                  <User size={16} /> Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="nav-item" style={{ background: 'var(--accent-purple)', color: '#fff' }}>
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              {role === 'CUSTOMER' && (
                <>
                  <li>
                    <Link to="/customer/dashboard" className={`nav-item ${location.pathname.includes('/customer/dashboard') ? 'active' : ''}`}>
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className={`nav-item ${location.pathname === '/products' ? 'active' : ''}`}>
                      <ShoppingBag size={16} /> Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" className={`nav-item ${location.pathname === '/cart' ? 'active' : ''}`}>
                      <ShoppingCart size={16} /> Cart
                      {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className={`nav-item ${location.pathname === '/orders' ? 'active' : ''}`}>
                      <Package size={16} /> My Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/addresses" className={`nav-item ${location.pathname === '/addresses' ? 'active' : ''}`}>
                      <MapPin size={16} /> Addresses
                    </Link>
                  </li>
                </>
              )}

              {role === 'EMPLOYEE' && (
                <>
                  <li>
                    <Link to="/employee/dashboard" className={`nav-item ${location.pathname.includes('/employee/dashboard') ? 'active' : ''}`}>
                      <LayoutDashboard size={16} /> Employee Portal
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className={`nav-item ${location.pathname === '/orders' ? 'active' : ''}`}>
                      <Package size={16} /> All Orders
                    </Link>
                  </li>
                </>
              )}

              {role === 'SELLER' && (
                <>
                  <li>
                    <Link to="/seller/dashboard" className={`nav-item ${location.pathname.includes('/seller/dashboard') ? 'active' : ''}`}>
                      <LayoutDashboard size={16} /> Seller Portal
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className={`nav-item ${location.pathname === '/orders' ? 'active' : ''}`}>
                      <Package size={16} /> Received Orders
                    </Link>
                  </li>
                </>
              )}

              {role === 'ADMIN' && (
                <>
                  <li>
                    <Link to="/admin/dashboard" className={`nav-item ${location.pathname.includes('/admin/dashboard') ? 'active' : ''}`}>
                      <ShieldAlert size={16} /> Admin Console
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className={`nav-item ${location.pathname === '/products' ? 'active' : ''}`}>
                      <ShoppingBag size={16} /> Catalog
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className={`nav-item ${location.pathname === '/orders' ? 'active' : ''}`}>
                      <Package size={16} /> All Orders
                    </Link>
                  </li>
                </>
              )}

              {/* Notifications & User profile & Logout */}
              <li style={{ display: 'flex', alignItems: 'center' }}>
                <NotificationBell />
              </li>
              <li className="user-menu">
                <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                  <User size={16} /> {user.email.split('@')[0]}
                  <span className={`badge badge-${targetDb}`}>{role}</span>
                </Link>
                <button onClick={handleLogout} className="btn-logout" title="Logout">
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
