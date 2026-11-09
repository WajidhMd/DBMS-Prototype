import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
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
  Moon,
  Mic,
  Camera,
  X,
  Sparkles
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

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Advanced Search Features (Voice, Visual, Auto-suggest)
  const [suggestions, setSuggestions] = useState({ products: [], brands: [] });
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [visualSearchLoading, setVisualSearchLoading] = useState(false);
  const visualInputRef = React.useRef(null);
  const searchWrapperRef = React.useRef(null);

  useEffect(() => {
    fetchCategories();
  }, [location.pathname, targetDb]);

  // Click outside listener for search suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setIsSuggestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Auto-suggestion Fetch
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSuggestions({ products: [], brands: [] });
      setIsSuggestOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/products/suggestions', { params: { q: trimmed } });
        setSuggestions(res.data || { products: [], brands: [] });
        setIsSuggestOpen(true);
      } catch (err) {
        // ignore suggestions error
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Voice Search Handler
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice Search is not supported on this browser. Please try Google Chrome or Microsoft Edge.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      setIsListening(true);

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setSearchQuery(speechResult);
        setIsListening(false);
        setIsSuggestOpen(false);
        navigate(`/products?q=${encodeURIComponent(speechResult)}`);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  // Visual Image Search Handler
  const handleVisualUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVisualSearchLoading(true);
    // Parse visual keywords from file name or detect general object
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_\-\d]/g, ' ').trim();
    setTimeout(() => {
      setVisualSearchLoading(false);
      const queryTerm = cleanName.length > 2 ? cleanName : 'Fashion';
      setSearchQuery(queryTerm);
      setIsSuggestOpen(false);
      navigate(`/products?q=${encodeURIComponent(queryTerm)}`);
    }, 600);
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

        {/* Advanced Global Search Bar with Auto-suggest, Voice & Visual Search */}
        <div className="jmart-search-wrapper" ref={searchWrapperRef}>
          <form onSubmit={handleSearchSubmit} className="jmart-search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search products, brands, luxury deals..."
              value={searchQuery}
              onFocus={() => {
                if (suggestions.products.length > 0 || suggestions.brands.length > 0) {
                  setIsSuggestOpen(true);
                }
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Clear Input Button */}
            {searchQuery && (
              <button
                type="button"
                className="search-action-btn search-clear-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions({ products: [], brands: [] });
                  setIsSuggestOpen(false);
                }}
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}

            {/* Voice Search Button */}
            <button
              type="button"
              className={`search-action-btn voice-search-btn ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceSearch}
              title={isListening ? 'Listening... Speak now' : 'Search by Voice'}
            >
              <Mic size={16} />
            </button>

            {/* Visual Search Button & Hidden File Input */}
            <input
              type="file"
              ref={visualInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleVisualUpload}
            />
            <button
              type="button"
              className={`search-action-btn visual-search-btn ${visualSearchLoading ? 'loading' : ''}`}
              onClick={() => visualInputRef.current?.click()}
              title="Search by Image / Visual Upload"
            >
              <Camera size={16} />
            </button>

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

          {/* Auto-suggest Results Dropdown */}
          {isSuggestOpen && (suggestions.products.length > 0 || suggestions.brands.length > 0) && (
            <div className="search-suggestions-dropdown">
              {suggestions.brands.length > 0 && (
                <div className="suggestions-brand-strip">
                  <span className="strip-title">Brands:</span>
                  {suggestions.brands.map((b) => (
                    <button
                      key={b}
                      type="button"
                      className="brand-suggestion-pill"
                      onClick={() => {
                        setSearchQuery(b);
                        setIsSuggestOpen(false);
                        navigate(`/products?brand=${encodeURIComponent(b)}`);
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}

              {suggestions.products.length > 0 && (
                <div className="suggestions-products-list">
                  <div className="suggestions-header">Products matching "{searchQuery}"</div>
                  {suggestions.products.map((p) => (
                    <div
                      key={p.product_id}
                      className="suggestion-item"
                      onClick={() => {
                        setIsSuggestOpen(false);
                        navigate(`/products/${p.product_id}`);
                      }}
                    >
                      <img src={p.image_url} alt={p.product_name} className="suggestion-thumb" />
                      <div className="suggestion-info">
                        <div className="suggestion-name">{p.product_name}</div>
                        <div className="suggestion-meta">
                          {p.brand && <span className="suggestion-brand">{p.brand} · </span>}
                          <span className="suggestion-cat">{p.category_name}</span>
                        </div>
                      </div>
                      <div className="suggestion-price">₹{Number(p.mrp).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="view-all-results-btn"
                onClick={(e) => {
                  handleSearchSubmit(e);
                  setIsSuggestOpen(false);
                }}
              >
                <Sparkles size={14} /> See all results for "{searchQuery}"
              </button>
            </div>
          )}
        </div>
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
          to="/wishlist"
          className="header-icon-btn wishlist-btn"
          title={`Wishlist (${wishlistCount} items)`}
        >
          <Heart
            size={20}
            className={wishlistCount > 0 ? 'heart-has-items' : ''}
            fill={wishlistCount > 0 ? 'var(--color-primary)' : 'none'}
          />
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
