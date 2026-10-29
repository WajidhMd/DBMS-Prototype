import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import api from '../services/api';
import { Search, Filter, ShoppingBag, ShoppingCart, Eye, Star, Layers, CheckCircle } from 'lucide-react';

export default function Products() {
  const { user, role } = useAuth();
  const { targetDb } = useDb();
  const navigate = useNavigate();

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    if (!user) {
      navigate('/login');
      return;
    }
    if (role !== 'CUSTOMER') {
      alert('Only Customer accounts can add items to cart.');
      return;
    }
    try {
      await api.post('/cart', { product_id: product.product_id, quantity: 1 });
      alert(`Added "${product.product_name}" to your cart!`);
    } catch (err) {
      alert('Failed to add item to cart.');
    }
  };

  // Filter & Sort Logic
  let filtered = [...products];

  if (search.trim()) {
    const query = search.toLowerCase();
    filtered = filtered.filter(p => p.product_name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));
  }
  if (selectedCategory) {
    filtered = filtered.filter(p => p.category_id === selectedCategory);
  }
  if (selectedBrand) {
    filtered = filtered.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
  }
  if (minPrice) {
    filtered = filtered.filter(p => parseFloat(p.mrp) >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(p => parseFloat(p.mrp) <= parseFloat(maxPrice));
  }

  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => parseFloat(a.mrp) - parseFloat(b.mrp));
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => parseFloat(b.mrp) - parseFloat(a.mrp));
  } else if (sortBy === 'name_asc') {
    filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
  }

  // Unique Brands list for dropdown
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className={`badge badge-${targetDb}`}>{targetDb.toUpperCase()} CATALOG</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Showing {filtered.length} products</span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Explore Products & Gadgets</h1>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        alignItems: 'end'
      }}>
        {/* Search */}
        <div>
          <label className="form-label" style={{ fontSize: '0.78rem' }}>Search Product / Brand</label>
          <div className="input-container">
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Headphones, Laptop..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="form-label" style={{ fontSize: '0.78rem' }}>Category</label>
          <select
            className="form-input"
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="form-label" style={{ fontSize: '0.78rem' }}>Brand</label>
          <select
            className="form-input"
            value={selectedBrand}
            onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Brands</option>
            {uniqueBrands.map((b, i) => (
              <option key={i} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="form-label" style={{ fontSize: '0.78rem' }}>Sort By</label>
          <select
            className="form-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Default Order</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>

        {/* Reset Filters */}
        <div>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
              setSelectedBrand('');
              setMinPrice('');
              setMaxPrice('');
              setSortBy('');
              setCurrentPage(1);
            }}
            className="btn-secondary-outline"
            style={{ width: '100%', padding: '0.7rem' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>Fetching products from {targetDb.toUpperCase()} database...</p>
      ) : paginatedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
          <ShoppingBag size={48} style={{ opacity: 0.4, marginBottom: '1rem' }} />
          <h3>No matching products found.</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Try broadening your search or resetting filters.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {paginatedProducts.map(p => (
            <div
              key={p.product_id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-purple)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div>
                {/* Product Image Container */}
                <div style={{
                  width: '100%',
                  height: '180px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)'
                }}>
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.product_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div style={{ display: p.image_url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                    <ShoppingBag size={48} opacity={0.6} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{p.category_name || 'Category'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seller: {p.seller_name}</span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1.3 }}>
                  {p.product_name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Brand: <strong style={{ color: 'var(--text-primary)' }}>{p.brand}</strong>
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>MRP Price</span>
                    <strong style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-purple)' }}>${parseFloat(p.mrp).toFixed(2)}</strong>
                  </div>
                  <span className={`badge ${p.stock_qty > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {p.stock_qty > 0 ? `${p.stock_qty} in stock` : 'Out of Stock'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <Link to={`/products/${p.product_id}`} className="btn-secondary-outline" style={{ fontSize: '0.82rem', padding: '0.6rem' }}>
                    <Eye size={14} /> Details
                  </Link>

                  <button
                    onClick={() => handleAddToCart(p)}
                    disabled={p.stock_qty <= 0}
                    className="btn-primary-block"
                    style={{ fontSize: '0.82rem', padding: '0.6rem', marginTop: 0 }}
                  >
                    <ShoppingCart size={14} /> Add Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-secondary-outline"
            style={{ width: 'auto', padding: '0.4rem 0.85rem' }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0.5rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-secondary-outline"
            style={{ width: 'auto', padding: '0.4rem 0.85rem' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
