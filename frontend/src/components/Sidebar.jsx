import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  Package,
  MapPin,
  ShieldAlert,
  LayoutDashboard,
  Percent,
  HelpCircle,
  LogOut,
  LogIn,
  Layers,
  ChevronRight,
  Database,
  Sun,
  Moon
} from 'lucide-react';
import HelpModal from './HelpModal';
import './Sidebar.css';

const SIDEBAR_CATEGORIES = [
  'Echo and Alexa',
  'Kindle',
  'Books',
  'Electronics',
  'Home and Garden',
  'Fashion',
  'Health and Beauty',
  'Automotive',
  'Sport and Tourism',
  'Games',
  'Film and Music',
  'Animals',
  'Hobby',
  'Gift Cards'
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, role, logout } = useAuth();
  const { targetDb, setTargetDb } = useDb();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showHelp, setShowHelp] = useState(false);

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    if (onClose) onClose();
  };

  const handleDbChange = (db) => {
    if (targetDb !== db) {
      setTargetDb(db);
      window.location.reload();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <>
      <aside className={`jmart-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-wrapper">
          <Link to="/" className="jmart-logo" onClick={onClose}>
            <div className="logo-main">
              <span className="logo-text">jmart</span>
              <span className="logo-domain">.in</span>
            </div>
            {/* Signature smile arrow vector styled in Luxury Gold */}
            <svg className="jmart-smile-curve" viewBox="0 0 100 24" width="76" height="15">
              <path d="M 6 6 Q 50 25 90 7" fill="transparent" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 84 4 L 92 7 L 85 13 Z" fill="var(--color-primary)" stroke="var(--color-primary)" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Database Quick Switcher inside Sidebar */}
        <div className="sidebar-db-widget">
          <div className="sidebar-db-label">
            <Database size={13} />
            <span>ACTIVE DB: <strong>{targetDb.toUpperCase()}</strong></span>
          </div>
          <div className="sidebar-db-toggle">
            <button
              className={`db-toggle-btn ${targetDb === 'postgresql' ? 'active-pg' : ''}`}
              onClick={() => handleDbChange('postgresql')}
              title="Switch to PostgreSQL Engine"
            >
              PostgreSQL
            </button>
            <button
              className={`db-toggle-btn ${targetDb === 'mongodb' ? 'active-mongo' : ''}`}
              onClick={() => handleDbChange('mongodb')}
              title="Switch to MongoDB Engine"
            >
              MongoDB
            </button>
          </div>
        </div>

        {/* Categories Section Heading Pill */}
        <div className="sidebar-section-pill">
          <LayoutGrid size={17} className="pill-icon" />
          <span>Categories</span>
        </div>

        {/* Categories List */}
        <div className="sidebar-categories-scroll">
          <ul className="sidebar-categories-list">
            {SIDEBAR_CATEGORIES.map((cat, idx) => {
              const queryParams = new URLSearchParams(location.search);
              const isActive = location.pathname === '/products' && queryParams.get('category') === cat;
              return (
                <li key={idx}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className={`sidebar-category-link ${isActive ? 'active' : ''}`}
                  >
                    <span>{cat}</span>
                    <ChevronRight size={13} className="arrow-hint" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Portal Navigation */}
        <div className="sidebar-portal-nav">
          <div className="sidebar-section-title">Navigation</div>
          <ul className="sidebar-nav-links">
            <li>
              <Link to="/products" className={`sidebar-nav-item ${location.pathname === '/products' ? 'active' : ''}`} onClick={onClose}>
                <ShoppingBag size={16} /> Products Catalog
              </Link>
            </li>

            {user && role === 'CUSTOMER' && (
              <>
                <li>
                  <Link to="/customer/dashboard" className={`sidebar-nav-item ${location.pathname === '/customer/dashboard' ? 'active' : ''}`} onClick={onClose}>
                    <LayoutDashboard size={16} /> My Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className={`sidebar-nav-item ${location.pathname === '/orders' ? 'active' : ''}`} onClick={onClose}>
                    <Package size={16} /> My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className={`sidebar-nav-item ${location.pathname === '/cart' ? 'active' : ''}`} onClick={onClose}>
                    <ShoppingCart size={16} /> Shopping Cart
                  </Link>
                </li>
                <li>
                  <Link to="/addresses" className={`sidebar-nav-item ${location.pathname === '/addresses' ? 'active' : ''}`} onClick={onClose}>
                    <MapPin size={16} /> Delivery Addresses
                  </Link>
                </li>
              </>
            )}

            {user && role === 'SELLER' && (
              <>
                <li>
                  <Link to="/seller/dashboard" className={`sidebar-nav-item ${location.pathname === '/seller/dashboard' ? 'active' : ''}`} onClick={onClose}>
                    <LayoutDashboard size={16} /> Seller Portal
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className={`sidebar-nav-item ${location.pathname === '/orders' ? 'active' : ''}`} onClick={onClose}>
                    <Package size={16} /> Received Orders
                  </Link>
                </li>
              </>
            )}

            {user && role === 'EMPLOYEE' && (
              <>
                <li>
                  <Link to="/employee/dashboard" className={`sidebar-nav-item ${location.pathname === '/employee/dashboard' ? 'active' : ''}`} onClick={onClose}>
                    <LayoutDashboard size={16} /> Employee Portal
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className={`sidebar-nav-item ${location.pathname === '/orders' ? 'active' : ''}`} onClick={onClose}>
                    <Package size={16} /> All Orders
                  </Link>
                </li>
              </>
            )}

            {user && role === 'ADMIN' && (
              <>
                <li>
                  <Link to="/admin/dashboard" className={`sidebar-nav-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`} onClick={onClose}>
                    <ShieldAlert size={16} /> Admin Console
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className={`sidebar-nav-item ${location.pathname === '/orders' ? 'active' : ''}`} onClick={onClose}>
                    <Package size={16} /> All Orders
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Bottom Utility Items */}
        <div className="sidebar-footer-menu">
          {/* Dark / Light Mode Switch in Sidebar */}
          <button
            onClick={toggleTheme}
            className="sidebar-bottom-item theme-switch"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={15} color="var(--color-primary)" />
            ) : (
              <Moon size={15} color="var(--color-primary)" />
            )}
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>

          <Link
            to={role === 'SELLER' ? '/seller/dashboard' : '/register'}
            className="sidebar-bottom-item"
            onClick={onClose}
          >
            <Percent size={15} color="var(--color-primary)" />
            <span>Sell on JMART</span>
          </Link>

          <button
            onClick={() => setShowHelp(true)}
            className="sidebar-bottom-item"
          >
            <HelpCircle size={15} color="#8A8A8A" />
            <span>Help</span>
          </button>

          {user ? (
            <button onClick={handleLogout} className="sidebar-bottom-item logout">
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          ) : (
            <Link to="/login" className="sidebar-bottom-item login" onClick={onClose}>
              <LogIn size={15} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && <div className="sidebar-mobile-backdrop" onClick={onClose}></div>}

      {/* Help Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
