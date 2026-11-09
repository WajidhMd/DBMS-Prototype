import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import {
  Menu,
  Search,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Database,
  ExternalLink,
  ShieldAlert,
  LayoutDashboard,
  Package,
  Sun,
  Moon
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import HelpModal from './HelpModal';
import './Navbar.css';

export default function Navbar({ onOpenSidebar }) {
  const { user, role, logout } = useAuth();
  const { targetDb, setTargetDb } = useDb();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (role === 'CUSTOMER') {
      fetchCartCount();
    }
    fetchCategories();
    updateWishlistCount();

    // Listen to custom wishlist update events
    const handleWishlistChange = () => updateWishlistCount();
    window.addEventListener('storage', handleWishlistChange);
    window.addEventListener('jmart-wishlist-update', handleWishlistChange);

    return () => {
      window.removeEventListener('storage', handleWishlistChange);
      window.removeEventListener('jmart-wishlist-update', handleWishlistChange);
    };
  }, [role, location.pathname, targetDb]);

  const updateWishlistCount = () => {
    try {
      const items = JSON.parse(localStorage.getItem('jmart_wishlist') || '[]');
      setWishlistCount(items.length);
    } catch {
      setWishlistCount(0);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await api.get('/cart');
      setCartCount(res.data.items_total || 0);
    } catch (err) {
      setCartCount(0);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      // ignore
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (searchCategory) params.set('category_id', searchCategory);
    navigate(`/products?${params.toString()}`);
  };

  const handleDbChange = (db) => {
    if (targetDb !== db) {
      setTargetDb(db);
      window.location.reload();
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
  <>
    <header className="jmart-top-header">
      <div className="header-left-group">
        {/* JMART Hamburger All Button */}
        <button
          type="button"
          className="header-hamburger-btn"
          onClick={onOpenSidebar}
          aria-label="Open Navigation Menu"
          title="All Categories & Navigation"
        >
          <Menu size={22} className="hamburger-icon" />
          <span className="hamburger-text">All</span>
        </button>

        {/* JMART Brand Logo with Gold Smile */}
        <Link to="/" className="jmart-logo navbar-logo">
          <div className="logo-main">
            <span className="logo-text">jmart</span>
            <span className="logo-domain">.in</span>
          </div>
          <svg className="jmart-smile-curve" viewBox="0 0 100 24" width="76" height="15">
            <path d="M 6 6 Q 50 25 90 7" fill="transparent" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
            <path d="M 84 4 L 92 7 L 85 13 Z" fill="var(--color-primary)" stroke="var(--color-primary)" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="jmart-search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="search-category-select-wrapper">
            <select
              className="search-category-select"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="select-arrow" />
          </div>

          <button type="submit" className="search-submit-btn" title="Search">
            <Search size={16} />
          </button>
        </form>
      </div>

      <div className="header-right-group">
        {/* Target Database Pills */}
        <div className="header-db-selector" title="Active Target Database">
          <button
            type="button"
            className={`header-db-pill ${targetDb === 'postgresql' ? 'active-pg' : ''}`}
            onClick={() => handleDbChange('postgresql')}
          >
            PostgreSQL
          </button>
          <button
            type="button"
            className={`header-db-pill ${targetDb === 'mongodb' ? 'active-mongo' : ''}`}
            onClick={() => handleDbChange('mongodb')}
          >
            MongoDB
          </button>
        </div>

        {/* Dark / Light Mode Switcher Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="header-icon-btn theme-toggle-btn"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark/light theme"
        >
          {theme === 'dark' ? (
            <Sun size={19} className="theme-icon-sun" />
          ) : (
            <Moon size={19} className="theme-icon-moon" />
          )}
        </button>

        {/* Wishlist Heart Icon */}
        <Link
          to="/products"
          className="header-icon-btn wishlist-btn"
          title={`Wishlist (${wishlistCount} items)`}
        >
          <Heart size={20} className={wishlistCount > 0 ? 'heart-has-items' : ''} />
          {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
        </Link>

        {/* Cart Button with Badge */}
        <Link to="/cart" className="header-cart-btn" title="Shopping Cart">
          <ShoppingCart size={19} className="cart-icon" />
          {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
        </Link>

        {/* Notification Bell */}
        {user && <NotificationBell />}

        {/* User Profile Avatar / Menu */}
        {user ? (
          <div className="header-user-dropdown-wrapper">
            <button
              className="header-user-avatar-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="user-avatar-circle">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={14} className="user-dropdown-arrow" />
            </button>

            {userDropdownOpen && (
              <>
                <div
                  className="dropdown-backdrop"
                  onClick={() => setUserDropdownOpen(false)}
                />
                <div className="user-dropdown-card">
                  <div className="dropdown-user-info">
                    <strong className="user-email-text">{user.email}</strong>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                      {role}
                    </span>
                  </div>

                  <hr className="dropdown-divider" />

                  <div className="dropdown-links">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={15} /> My Profile
                    </Link>

                    {role === 'CUSTOMER' && (
                      <>
                        <Link
                          to="/customer/dashboard"
                          className="dropdown-item"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <LayoutDashboard size={15} /> Customer Dashboard
                        </Link>
                        <Link
                          to="/orders"
                          className="dropdown-item"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Package size={15} /> My Orders
                        </Link>
                      </>
                    )}

                    {role === 'SELLER' && (
                      <Link
                        to="/seller/dashboard"
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LayoutDashboard size={15} /> Seller Portal
                      </Link>
                    )}

                    {role === 'EMPLOYEE' && (
                      <Link
                        to="/employee/dashboard"
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LayoutDashboard size={15} /> Employee Portal
                      </Link>
                    )}

                    {role === 'ADMIN' && (
                      <Link
                        to="/admin/dashboard"
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <ShieldAlert size={15} /> Admin Console
                      </Link>
                    )}
                  </div>

                  <hr className="dropdown-divider" />

                  <button onClick={handleLogout} className="dropdown-logout-btn">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="header-auth-buttons">
            <Link to="/login" className="btn-header-login">
              Sign In
            </Link>
            <Link to="/register" className="btn-header-register">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>

    {/* JMART Sub-navigation Category Bar */}
    <nav className="jmart-subnav-strip" aria-label="Quick Categories Navigation">
      <button
        type="button"
        className="subnav-item subnav-all-btn"
        onClick={onOpenSidebar}
      >
        <Menu size={16} />
        <span>All</span>
      </button>
      <Link to="/products?sort=popular" className="subnav-item">Bestsellers</Link>
      <Link to="/products?category_id=cat-011" className="subnav-item">Mobiles</Link>
      <Link to="/products?category_id=cat-001" className="subnav-item">Electronics</Link>
      <Link to="/products?category_id=cat-002" className="subnav-item">Fashion</Link>
      <Link to="/products?category_id=cat-003" className="subnav-item">Home &amp; Kitchen</Link>
      <Link to="/products?category_id=cat-007" className="subnav-item">Beauty</Link>
      <Link to="/products?category_id=cat-004" className="subnav-item">Books</Link>
      <Link to="/products?sort=newest" className="subnav-item">New Releases</Link>
      <button
        type="button"
        onClick={() => setShowHelp(true)}
        className="subnav-item subnav-help-item"
      >
        Customer Service
      </button>
    </nav>

    {/* Help & Support Modal */}
    {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
  </>
  );
}
