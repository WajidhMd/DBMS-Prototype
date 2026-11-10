import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import {
  Search,
  ShoppingCart,
  Eye,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Armchair,
  Smartphone,
  Camera,
  Shirt,
  Bike,
  Headphones,
  Boxes,
  Gamepad2,
  Sparkles,
  Watch,
  Filter,
  Check,
  ShoppingBag
} from 'lucide-react';
import './Products.css';

// Popular Category Tiles with custom Lucide Icons matching the screenshot
const POPULAR_CATEGORIES = [
  { id: 'laptops', name: 'Laptops', query: 'Laptop', icon: Laptop },
  { id: 'furniture', name: 'Furniture', query: 'Home', icon: Armchair },
  { id: 'mobiles', name: 'Mobiles', query: 'Phone', icon: Smartphone },
  { id: 'cameras', name: 'Cameras', query: 'Camera', icon: Camera },
  { id: 'fashion', name: 'Fashion', query: 'Fashion', icon: Shirt },
  { id: 'sports', name: 'Sports', query: 'Sport', icon: Bike },
  { id: 'audio', name: 'Audio', query: 'Headphones', icon: Headphones },
  { id: 'toys', name: 'Toys', query: 'Toy', icon: Boxes },
  { id: 'gaming', name: 'Gaming', query: 'Game', icon: Gamepad2 },
  { id: 'beauty', name: 'Beauty', query: 'Beauty', icon: Sparkles },
  { id: 'watches', name: 'Watches', query: 'Watch', icon: Watch }
];

export default function Products() {
  const { user, role } = useAuth();
  const { targetDb } = useDb();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [activePopularTile, setActivePopularTile] = useState(null);

  // Faceted Filters
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState('');
  const [minDiscount, setMinDiscount] = useState('');

  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedToast, setAddedToast] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const catalogSectionRef = useRef(null);

  // Parse URL search params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = params.get('q');
    const catIdParam = params.get('category_id');
    const catNameParam = params.get('category');
    const sortParam = params.get('sort');
    const maxPriceParam = params.get('max_price');

    if (qParam !== null) {
      setSearch(qParam);
    } else if (catNameParam !== null) {
      setSearch(catNameParam);
    } else {
      setSearch('');
    }

    if (catIdParam !== null) {
      setSelectedCategory(catIdParam);
    } else {
      setSelectedCategory('');
    }

    if (sortParam !== null) {
      setSortBy(sortParam);
    }
    if (maxPriceParam !== null) {
      setMaxPrice(maxPriceParam);
    }

    setCurrentPage(1);
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [targetDb]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleAddToCart = async (product) => {
    if (product.stock_qty <= 0) {
      alert('This product is currently out of stock.');
      return;
    }
    const res = await addToCart(product, 1);
    if (res.success) {
      setAddedToast(`Added "${product.product_name}" to your cart!`);
      setTimeout(() => setAddedToast(null), 3000);
    }
  };

  const handlePopularTileClick = (tile) => {
    if (activePopularTile === tile.id) {
      setActivePopularTile(null);
      setSearch('');
    } else {
      setActivePopularTile(tile.id);
      setSearch(tile.query);
      setCurrentPage(1);
    }
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCatalog = () => {
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter & Sort Logic
  let filtered = [...products];

  if (search.trim()) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.product_name.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        (p.category_name && p.category_name.toLowerCase().includes(query))
    );
  }
  if (selectedCategory) {
    filtered = filtered.filter((p) => p.category_id === selectedCategory);
  }
  if (selectedBrand) {
    filtered = filtered.filter(
      (p) => p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase()
    );
  }
  if (minPrice) {
    filtered = filtered.filter((p) => parseFloat(p.mrp) >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => parseFloat(p.mrp) <= parseFloat(maxPrice));
  }
  if (inStockOnly) {
    filtered = filtered.filter((p) => (p.stock_qty || 0) > 0);
  }
  if (minRating) {
    filtered = filtered.filter((p) => {
      const num = parseInt(p.product_id.replace(/\D/g, '') || '12', 10);
      const ratingVal = 4.5 + (num % 5) * 0.1;
      return ratingVal >= parseFloat(minRating);
    });
  }
  if (minDiscount) {
    filtered = filtered.filter((p) => {
      const num = parseInt(p.product_id.replace(/\D/g, '') || '12', 10);
      const disc = 15 + (num % 20); // 15% - 35% discount
      return disc >= parseFloat(minDiscount);
    });
  }

  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => parseFloat(a.mrp) - parseFloat(b.mrp));
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => parseFloat(b.mrp) - parseFloat(a.mrp));
  } else if (sortBy === 'name_asc') {
    filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
  }

  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate consistent fake review count / discount strikethrough for aesthetic fidelity
  const getProductDisplayMeta = (product) => {
    const num = parseInt(product.product_id.replace(/\D/g, '') || '12', 10);
    const rating = (4.5 + (num % 5) * 0.1).toFixed(1);
    const reviewsCount = (2500 + num * 987).toLocaleString();
    const originalPrice = (parseFloat(product.mrp) * 1.15).toFixed(2);
    return { rating, reviewsCount, originalPrice };
  };

  return (
    <div className="jmart-products-page animate-fade-in">
      {/* 1. Hero Promotional Banner */}
      <section className="jmart-hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Free Delivery!</h1>
          <p className="hero-subtitle">
            Don't miss it out! Only today, get free Next Day delivery on all of your orders.
          </p>
          <button onClick={scrollToCatalog} className="hero-action-btn">
            Browse products
          </button>
        </div>

        {/* Decorative Orange Cursor Vectors matching screenshot */}
        <div className="hero-vectors-backdrop" aria-hidden="true">
          <svg className="cursor-arrow arrow-1" viewBox="0 0 40 40" width="70" height="70">
            <path
              d="M 6 6 L 16 34 L 21 21 L 34 16 Z"
              fill="rgba(255, 255, 255, 0.18)"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="2"
            />
          </svg>
          <svg className="cursor-arrow arrow-2" viewBox="0 0 40 40" width="105" height="105">
            <path
              d="M 6 6 L 16 34 L 21 21 L 34 16 Z"
              fill="rgba(255, 255, 255, 0.14)"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="2.5"
            />
          </svg>
          <svg className="cursor-arrow arrow-3" viewBox="0 0 40 40" width="85" height="85">
            <path
              d="M 6 6 L 16 34 L 21 21 L 34 16 Z"
              fill="rgba(255, 255, 255, 0.16)"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="2"
            />
          </svg>
          <svg className="cursor-arrow arrow-4" viewBox="0 0 40 40" width="50" height="50">
            <path
              d="M 6 6 L 16 34 L 21 21 L 34 16 Z"
              fill="rgba(255, 255, 255, 0.12)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </section>

      {/* 2. Popular Categories ⭐ Section */}
      <section className="jmart-popular-categories-section">
        <div className="section-header-row">
          <h2 className="section-heading">Popular categories <span className="star-icon">⭐</span></h2>
        </div>

        <div className="popular-categories-tiles-row">
          {POPULAR_CATEGORIES.map((tile) => {
            const Icon = tile.icon;
            const isSelected = activePopularTile === tile.id;
            return (
              <button
                key={tile.id}
                onClick={() => handlePopularTileClick(tile)}
                className={`category-tile-btn ${isSelected ? 'active-tile' : ''}`}
                title={tile.name}
              >
                <Icon size={22} className="tile-icon" />
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Filter Toolbar */}
      <div className="jmart-filters-toolbar">
        <div className="filter-group">
          <label className="filter-label">Search Keywords</label>
          <div className="filter-input-wrap">
            <Search size={14} className="filter-icon" />
            <input
              type="text"
              className="filter-input"
              placeholder="Search product, brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActivePopularTile(null);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Brand</label>
          <select
            className="filter-select"
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Brands</option>
            {uniqueBrands.map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sort Order</label>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Default Order</option>
            <option value="popular">Bestsellers / Most Popular</option>
            <option value="newest">New Releases</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>

        {/* Faceted Rating Filter */}
        <div className="filter-group">
          <label className="filter-label">Customer Rating</label>
          <select
            className="filter-select"
            value={minRating}
            onChange={(e) => {
              setMinRating(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Ratings</option>
            <option value="4.7">4.7★ & above (Top Rated)</option>
            <option value="4.5">4.5★ & above</option>
            <option value="4.0">4.0★ & above</option>
          </select>
        </div>

        {/* Faceted Discount Filter */}
        <div className="filter-group">
          <label className="filter-label">Deals & Discounts</label>
          <select
            className="filter-select"
            value={minDiscount}
            onChange={(e) => {
              setMinDiscount(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Deals</option>
            <option value="15">15% OFF or more</option>
            <option value="20">20% OFF or more</option>
            <option value="25">25% OFF or more</option>
          </select>
        </div>

        {/* In-Stock Only Toggle */}
        <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <label className="filter-label" style={{ cursor: 'pointer' }}>Availability</label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer', color: '#D4D4D4' }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => {
                setInStockOnly(e.target.checked);
                setCurrentPage(1);
              }}
              style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
            In Stock Only
          </label>
        </div>

        <div className="filter-group filter-actions">
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
              setSelectedBrand('');
              setMinPrice('');
              setMaxPrice('');
              setSortBy('');
              setMinRating('');
              setMinDiscount('');
              setInStockOnly(false);
              setActivePopularTile(null);
              setCurrentPage(1);
            }}
            className="btn-clear-filters"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 4. Hot deals 🔥 Catalog Section */}
      <section className="jmart-deals-section" ref={catalogSectionRef}>
        {addedToast && (
          <div
            style={{
              padding: '0.65rem 1.25rem',
              marginBottom: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <span>{addedToast}</span>
            <Link to="/cart" style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', marginLeft: '1rem', fontSize: '0.85rem' }}>
              View Cart →
            </Link>
          </div>
        )}
        <div className="section-header-row">
          <div className="deals-title-wrap">
            <h2 className="section-heading">Hot deals <span className="fire-icon">🔥</span></h2>
            <span className="results-count-badge">
              {filtered.length} products found in <strong>{targetDb.toUpperCase()}</strong>
            </span>
          </div>

          {/* Carousel Arrow Controls */}
          <div className="deals-pagination-arrows">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="arrow-nav-btn"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="page-indicator-text">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="arrow-nav-btn"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Catalog Layout with Faceted Sidebar & Products Grid */}
        <div className="catalog-layout-container">
          {/* Faceted Sidebar Filter Panel */}
          <aside className="catalog-faceted-sidebar">
            <div className="sidebar-heading-row">
              <span className="sidebar-title">
                <Filter size={16} /> Faceted Filters
              </span>
              {(selectedCategory || selectedBrand || minPrice || maxPrice || minRating || minDiscount || inStockOnly || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('');
                    setSelectedBrand('');
                    setMinPrice('');
                    setMaxPrice('');
                    setSortBy('');
                    setMinRating('');
                    setMinDiscount('');
                    setInStockOnly(false);
                    setActivePopularTile(null);
                    setCurrentPage(1);
                  }}
                  className="sidebar-reset-btn"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Price Range Slider */}
            <div>
              <span className="sidebar-section-title">
                Price Range: ₹{minPrice || 0} – {maxPrice ? `₹${Number(maxPrice).toLocaleString('en-IN')}` : '₹1,50,000+'}
              </span>
              <input
                type="range"
                min="500"
                max="150000"
                step="1000"
                value={maxPrice || 150000}
                onChange={(e) => {
                  setMaxPrice(e.target.value === '150000' ? '' : e.target.value);
                  setCurrentPage(1);
                }}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer', marginBottom: '0.5rem' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.78rem' }}
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.78rem' }}
                />
              </div>

              {/* Quick Price Bracket Pills */}
              <div className="price-bracket-pills">
                <button
                  type="button"
                  className={`price-pill ${maxPrice === '1000' ? 'active' : ''}`}
                  onClick={() => { setMinPrice(''); setMaxPrice('1000'); setCurrentPage(1); }}
                >
                  Under ₹1K
                </button>
                <button
                  type="button"
                  className={`price-pill ${minPrice === '1000' && maxPrice === '10000' ? 'active' : ''}`}
                  onClick={() => { setMinPrice('1000'); setMaxPrice('10000'); setCurrentPage(1); }}
                >
                  ₹1K - ₹10K
                </button>
                <button
                  type="button"
                  className={`price-pill ${minPrice === '10000' && maxPrice === '50000' ? 'active' : ''}`}
                  onClick={() => { setMinPrice('10000'); setMaxPrice('50000'); setCurrentPage(1); }}
                >
                  ₹10K - ₹50K
                </button>
                <button
                  type="button"
                  className={`price-pill ${minPrice === '50000' ? 'active' : ''}`}
                  onClick={() => { setMinPrice('50000'); setMaxPrice(''); setCurrentPage(1); }}
                >
                  Above ₹50K
                </button>
              </div>
            </div>

            {/* Brands Checkbox List */}
            <div>
              <span className="sidebar-section-title">Brand Selection</span>
              <div className="brand-checklist">
                {uniqueBrands.map((b) => {
                  const count = products.filter(p => p.brand === b).length;
                  const isChecked = selectedBrand.toLowerCase() === b.toLowerCase();
                  return (
                    <label key={b} className={`brand-check-item ${isChecked ? 'active' : ''}`}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedBrand(isChecked ? '' : b);
                            setCurrentPage(1);
                          }}
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        {b}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', opacity: 0.8 }}>({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Minimum Star Rating */}
            <div>
              <span className="sidebar-section-title">Customer Ratings</span>
              <div className="rating-filter-group">
                {[
                  { label: '4.7★ & above (Top Rated)', val: '4.7' },
                  { label: '4.5★ & above', val: '4.5' },
                  { label: '4.0★ & above', val: '4.0' }
                ].map((r) => (
                  <label key={r.val} className={`rating-filter-row ${minRating === r.val ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="sidebar_min_rating"
                      checked={minRating === r.val}
                      onChange={() => {
                        setMinRating(minRating === r.val ? '' : r.val);
                        setCurrentPage(1);
                      }}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Deals & Discount */}
            <div>
              <span className="sidebar-section-title">Deals & Offers</span>
              <div className="rating-filter-group">
                {[
                  { label: '15% OFF or more', val: '15' },
                  { label: '20% OFF or more', val: '20' },
                  { label: '25% OFF or more', val: '25' }
                ].map((d) => (
                  <label key={d.val} className={`rating-filter-row ${minDiscount === d.val ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="sidebar_min_discount"
                      checked={minDiscount === d.val}
                      onChange={() => {
                        setMinDiscount(minDiscount === d.val ? '' : d.val);
                        setCurrentPage(1);
                      }}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In-Stock Availability Toggle */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', cursor: 'pointer', color: inStockOnly ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                In Stock Only
              </label>
            </div>
          </aside>

          {/* Right Column: Products Grid & Pagination */}
          <div className="catalog-main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
            {/* Products Grid */}
            {loading ? (
          <div className="jmart-loading-box">
            <div className="loading-spinner"></div>
            <p>Fetching active catalog from {targetDb.toUpperCase()} database...</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="jmart-empty-catalog">
            <ShoppingBag size={48} className="empty-icon" />
            <h3>No matching products found</h3>
            <p>Try searching for different terms or reset your filters.</p>
          </div>
        ) : (
          <div className="jmart-products-grid">
            {paginatedProducts.map((p) => {
              const { rating, reviewsCount, originalPrice } = getProductDisplayMeta(p);
              const wishlisted = isWishlisted(p.product_id);

              return (
                <div key={p.product_id} className="jmart-product-card">
                  {/* Deal / Discount Badge */}
                  <div className="product-card-deal-badge">
                    {p.stock_qty <= 3 && p.stock_qty > 0 ? (
                      <span className="deal-pill urgent">⚡ Only {p.stock_qty} left</span>
                    ) : (
                      <span className="deal-pill">⚡ Lightning Deal</span>
                    )}
                  </div>

                  {/* Top Wishlist Heart Icon */}
                  <button
                    onClick={() => toggleWishlist(p)}
                    className={`product-wishlist-toggle ${wishlisted ? 'favorited' : ''}`}
                    title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart size={18} fill={wishlisted ? 'var(--color-primary)' : 'none'} />
                  </button>

                  {/* Product Image Presentation */}
                  <Link to={`/products/${p.product_id}`} className="product-image-container">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.product_name}
                        className="product-card-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="product-img-fallback"
                      style={{ display: p.image_url ? 'none' : 'flex' }}
                    >
                      <ShoppingBag size={44} opacity={0.35} />
                    </div>
                  </Link>

                  {/* Product Meta */}
                  <div className="product-info-block">
                    <Link to={`/products/${p.product_id}`} className="product-title-link">
                      <h3 className="product-card-title">{p.product_name}</h3>
                    </Link>

                    <div className="product-brand-line">
                      {p.brand || 'PACIFIC Choice'}
                    </div>

                    {/* Star Ratings: ★★★★★ 4.8 (21 032 reviews) */}
                    <div className="product-rating-row">
                      <div className="star-rating-stars">
                        <Star size={13} fill="#C6A15B" color="#C6A15B" />
                        <Star size={13} fill="#C6A15B" color="#C6A15B" />
                        <Star size={13} fill="#C6A15B" color="#C6A15B" />
                        <Star size={13} fill="#C6A15B" color="#C6A15B" />
                        <Star size={13} fill="#C6A15B" color="#C6A15B" />
                      </div>
                      <span className="rating-score">{rating}</span>
                      <span className="reviews-count">({reviewsCount} reviews)</span>
                    </div>

                    {/* Pricing */}
                    <div className="product-pricing-row">
                      <div className="price-group">
                        <span className="current-price">
                          ₹{parseFloat(p.mrp).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="original-strikethrough-price">
                          ₹{parseFloat(originalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <span
                        className={`stock-badge ${p.stock_qty > 0 ? 'in-stock' : 'out-of-stock'}`}
                      >
                        {p.stock_qty > 0 ? `${p.stock_qty} left` : 'Out of stock'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="product-actions-row">
                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={p.stock_qty <= 0}
                        className="btn-card-add-cart"
                      >
                        <ShoppingCart size={15} /> Add to Cart
                      </button>
                      <Link to={`/products/${p.product_id}`} className="btn-card-details">
                        <Eye size={15} /> Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <div className="jmart-pagination-footer">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-page-nav"
            >
              ← Previous
            </button>
            <div className="page-numbers-list">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`page-num-btn ${currentPage === num ? 'active-page' : ''}`}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn-page-nav"
            >
              Next →
            </button>
          </div>
        )}
          </div>
        </div>
      </section>
    </div>
  );
}
