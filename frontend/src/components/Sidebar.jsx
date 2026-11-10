import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { useTheme } from '../context/ThemeContext';
import {
  X,
  User,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Flame,
  Sparkles,
  Tv,
  Radio,
  Smartphone,
  Headphones,
  BookOpen,
  Film,
  Music,
  Laptop,
  Shirt,
  Armchair,
  ShoppingBag,
  Boxes,
  Car,
  Gamepad2,
  CreditCard,
  Rocket,
  Briefcase,
  HeartHandshake,
  Ticket,
  Tag,
  Globe,
  HelpCircle,
  LogIn,
  LogOut,
  Database,
  Sun,
  Moon,
  ArrowUp,
  Heart,
  UserCheck
} from 'lucide-react';
import HelpModal from './HelpModal';
import './Sidebar.css';

// All official store categories from database
const ALL_CATALOG_CATEGORIES = [
  { id: 'cat-001', name: 'Electronics & Gadgets' },
  { id: 'cat-002', name: 'Fashion & Apparel' },
  { id: 'cat-003', name: 'Home & Furniture' },
  { id: 'cat-004', name: 'Books & Stationery' },
  { id: 'cat-005', name: 'Toys & Games' },
  { id: 'cat-006', name: 'Video Games & Consoles' },
  { id: 'cat-007', name: 'Beauty & Personal Care' },
  { id: 'cat-008', name: 'Watches & Accessories' },
  { id: 'cat-009', name: 'Sports & Outdoors' },
  { id: 'cat-010', name: 'Cameras & Photography' },
  { id: 'cat-011', name: 'Phones & Accessories' }
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, role, logout } = useAuth();
  const { targetDb, setTargetDb } = useDb();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [showHelp, setShowHelp] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [programsExpanded, setProgramsExpanded] = useState(false);
  const sidebarContentRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNav = (path) => {
    navigate(path);
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

  const scrollToTop = () => {
    if (sidebarContentRef.current) {
      sidebarContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Derive user greeting name
  const getUserGreeting = () => {
    if (!user) return 'Sign in';
    if (user.email) {
      const namePart = user.email.split('@')[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return 'Customer';
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`jmart-sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sliding Sidebar Drawer */}
      <aside
        className={`jmart-drawer-sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Navigation Sidebar"
      >
        {/* Top Header Banner */}
        <div className="sidebar-header-banner">
          <div
            className="sidebar-user-greeting"
            onClick={() => handleNav(user ? '/profile' : '/login')}
            title={user ? 'View Profile' : 'Sign In to your account'}
          >
            <div className="sidebar-avatar-circle">
              <User size={20} color="#FFFFFF" />
            </div>
            <div className="sidebar-greeting-text">
              <span className="greeting-sub">Hello,</span>
              <span className="greeting-main">{getUserGreeting()}</span>
            </div>
            {role && (
              <span className="sidebar-role-badge">{role}</span>
            )}
          </div>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Menu Content */}
        <div className="sidebar-scrollable-body" ref={sidebarContentRef}>
          {/* Active Database & Theme Bar */}
          <div className="sidebar-quick-toggles">
            <div className="sidebar-db-toggle-row">
              <div className="db-toggle-label">
                <Database size={13} />
                <span>DB: <strong>{targetDb.toUpperCase()}</strong></span>
              </div>
              <div className="db-toggle-pills">
                <button
                  type="button"
                  className={`db-toggle-pill ${targetDb === 'postgresql' ? 'active-pg' : ''}`}
                  onClick={() => handleDbChange('postgresql')}
                >
                  PostgreSQL
                </button>
                <button
                  type="button"
                  className={`db-toggle-pill ${targetDb === 'mongodb' ? 'active-mongo' : ''}`}
                  onClick={() => handleDbChange('mongodb')}
                >
                  MongoDB
                </button>
              </div>
            </div>

            <button
              type="button"
              className="sidebar-theme-toggle-btn"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={14} color="#C6A15B" /> : <Moon size={14} color="#9B7938" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          {/* ═════════════════════════════════════════════ */}
          {/* 1. TRENDING                                  */}
          {/* ═════════════════════════════════════════════ */}
          <div className="sidebar-menu-section">
            <h3 className="sidebar-section-heading">Trending</h3>
            <ul className="sidebar-links-list">
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?sort=popular')}
                >
                  <TrendingUp size={16} className="item-icon" />
                  <span>Bestsellers</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?sort=newest')}
                >
                  <Sparkles size={16} className="item-icon" />
                  <span>New Releases</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
            </ul>
          </div>

          <div className="sidebar-divider" />

          {/* ═════════════════════════════════════════════ */}
          {/* 2. DIGITAL CONTENT AND DEVICES               */}
          {/* ═════════════════════════════════════════════ */}
          <div className="sidebar-menu-section">
            <h3 className="sidebar-section-heading">Digital Content and Devices</h3>
            <ul className="sidebar-links-list">
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?q=Echo')}
                >
                  <Radio size={16} className="item-icon" />
                  <span>Echo &amp; Alexa</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?q=TV')}
                >
                  <Tv size={16} className="item-icon" />
                  <span>Fire TV</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-004&q=Book')}
                >
                  <BookOpen size={16} className="item-icon" />
                  <span>Kindle E-Readers &amp; eBooks</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-004')}
                >
                  <Headphones size={16} className="item-icon" />
                  <span>Audible Audiobooks</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-006')}
                >
                  <Film size={16} className="item-icon" />
                  <span>PACIFIC Prime Video</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?q=Headphones')}
                >
                  <Music size={16} className="item-icon" />
                  <span>PACIFIC Music</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
            </ul>
          </div>

          <div className="sidebar-divider" />

          {/* ═════════════════════════════════════════════ */}
          {/* 3. SHOP BY CATEGORY                          */}
          {/* ═════════════════════════════════════════════ */}
          <div className="sidebar-menu-section">
            <h3 className="sidebar-section-heading">Shop by Category</h3>
            <ul className="sidebar-links-list">
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-011')}
                >
                  <Smartphone size={16} className="item-icon" />
                  <span>Mobiles, Computers</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-001')}
                >
                  <Laptop size={16} className="item-icon" />
                  <span>TV, Appliances, Electronics</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-002&q=Men')}
                >
                  <Shirt size={16} className="item-icon" />
                  <span>Men's Fashion</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-002&q=Women')}
                >
                  <ShoppingBag size={16} className="item-icon" />
                  <span>Women's Fashion</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-003')}
                >
                  <Armchair size={16} className="item-icon" />
                  <span>Home, Kitchen, Pets</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-007')}
                >
                  <Sparkles size={16} className="item-icon" />
                  <span>Beauty, Health, Grocery</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-009')}
                >
                  <ShoppingBag size={16} className="item-icon" />
                  <span>Sports, Fitness, Bags, Luggage</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-005')}
                >
                  <Boxes size={16} className="item-icon" />
                  <span>Toys, Baby Products, Kids' Fashion</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?q=Car')}
                >
                  <Car size={16} className="item-icon" />
                  <span>Car, Motorbike, Industrial</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-004')}
                >
                  <BookOpen size={16} className="item-icon" />
                  <span>Books</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-006')}
                >
                  <Gamepad2 size={16} className="item-icon" />
                  <span>Movies, Music &amp; Video Games</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>

              {/* Expandable All Categories List */}
              {categoriesExpanded && (
                <div className="sidebar-expanded-sublist animate-slide-down">
                  {ALL_CATALOG_CATEGORIES.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        className="sidebar-menu-item nested-item"
                        onClick={() => handleNav(`/products?category_id=${c.id}`)}
                      >
                        <span>{c.name}</span>
                        <ChevronRight size={13} className="item-arrow" />
                      </button>
                    </li>
                  ))}
                </div>
              )}

              {/* See All Categories Toggle */}
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item see-all-toggle"
                  onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                >
                  <span>{categoriesExpanded ? 'See less' : 'See all'}</span>
                  {categoriesExpanded ? (
                    <ChevronUp size={16} className="item-arrow-toggle" />
                  ) : (
                    <ChevronDown size={16} className="item-arrow-toggle" />
                  )}
                </button>
              </li>
            </ul>
          </div>

          <div className="sidebar-divider" />

          {/* ═════════════════════════════════════════════ */}
          {/* 4. PROGRAMS & FEATURES                       */}
          {/* ═════════════════════════════════════════════ */}
          <div className="sidebar-menu-section">
            <h3 className="sidebar-section-heading">Programs &amp; Features</h3>
            <ul className="sidebar-links-list">
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?q=Card')}
                >
                  <CreditCard size={16} className="item-icon" />
                  <span>Gift Cards &amp; Mobile Recharges</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?q=Tech')}
                >
                  <Rocket size={16} className="item-icon" />
                  <span>PACIFIC Launchpad</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav(role === 'SELLER' ? '/seller/dashboard' : '/register')}
                >
                  <Briefcase size={16} className="item-icon" />
                  <span>PACIFIC Business</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-003')}
                >
                  <HeartHandshake size={16} className="item-icon" />
                  <span>Handloom and Handicrafts</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?category_id=cat-007')}
                >
                  <Sparkles size={16} className="item-icon" />
                  <span>PACIFIC Saheli</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?q=Custom')}
                >
                  <Tag size={16} className="item-icon" />
                  <span>PACIFIC Custom</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?q=Travel')}
                >
                  <Ticket size={16} className="item-icon" />
                  <span>Flight Tickets</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?max_price=2499')}
                >
                  <Tag size={16} className="item-icon" />
                  <span>Clearance store</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/products?sort=popular')}
                >
                  <Globe size={16} className="item-icon" />
                  <span>International Brands</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>

              {/* See All Programs Toggle */}
              {programsExpanded && (
                <div className="sidebar-expanded-sublist animate-slide-down">
                  <li>
                    <button
                      type="button"
                      className="sidebar-menu-item nested-item"
                      onClick={() => handleNav('/products')}
                    >
                      <span>Explore All Deals &amp; Offers</span>
                      <ChevronRight size={13} className="item-arrow" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="sidebar-menu-item nested-item"
                      onClick={() => handleNav('/cart')}
                    >
                      <span>View Shopping Cart</span>
                      <ChevronRight size={13} className="item-arrow" />
                    </button>
                  </li>
                </div>
              )}

              <li>
                <button
                  type="button"
                  className="sidebar-menu-item see-all-toggle"
                  onClick={() => setProgramsExpanded(!programsExpanded)}
                >
                  <span>{programsExpanded ? 'See less' : 'See all'}</span>
                  {programsExpanded ? (
                    <ChevronUp size={16} className="item-arrow-toggle" />
                  ) : (
                    <ChevronDown size={16} className="item-arrow-toggle" />
                  )}
                </button>
              </li>
            </ul>
          </div>

          <div className="sidebar-divider" />

          {/* ═════════════════════════════════════════════ */}
          {/* 5. HELP & SETTINGS                           */}
          {/* ═════════════════════════════════════════════ */}
          <div className="sidebar-menu-section">
            <h3 className="sidebar-section-heading">Help &amp; Settings</h3>
            <ul className="sidebar-links-list">
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => {
                    if (!user) handleNav('/login');
                    else if (role === 'CUSTOMER') handleNav('/customer/dashboard');
                    else if (role === 'SELLER') handleNav('/seller/dashboard');
                    else if (role === 'EMPLOYEE') handleNav('/employee/dashboard');
                    else if (role === 'ADMIN') handleNav('/admin/dashboard');
                    else handleNav('/profile');
                  }}
                >
                  <User size={16} className="item-icon" />
                  <span>Your Account</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => setShowHelp(true)}
                >
                  <HelpCircle size={16} className="item-icon" />
                  <span>Customer Service</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>

              {user ? (
                <li>
                  <button
                    type="button"
                    className="sidebar-menu-item logout-action"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="item-icon" />
                    <span>Sign Out</span>
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    type="button"
                    className="sidebar-menu-item login-action"
                    onClick={() => handleNav('/login')}
                  >
                    <LogIn size={16} className="item-icon" />
                    <span>Sign in</span>
                  </button>
                </li>
              )}

              {/* Wishlist Link */}
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item"
                  onClick={() => handleNav('/wishlist')}
                >
                  <Heart size={16} className="item-icon" />
                  <span>My Wishlist</span>
                  <ChevronRight size={14} className="item-arrow" />
                </button>
              </li>

              {/* Admin Employee Management link */}
              {user && role === 'ADMIN' && (
                <li>
                  <button
                    type="button"
                    className="sidebar-menu-item"
                    onClick={() => handleNav('/admin/dashboard?tab=employees')}
                  >
                    <UserCheck size={16} className="item-icon" />
                    <span>Employee Management</span>
                    <ChevronRight size={14} className="item-arrow" />
                  </button>
                </li>
              )}

              {/* Back to top button */}
              <li>
                <button
                  type="button"
                  className="sidebar-menu-item back-to-top-btn"
                  onClick={scrollToTop}
                >
                  <ArrowUp size={16} className="item-icon" />
                  <span>Back to top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Help & Support Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
