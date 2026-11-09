import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useDb } from '../context/DbContext';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  PackageCheck
} from 'lucide-react';

export default function Wishlist() {
  const { wishlist, loading, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();
  const { targetDb } = useDb();

  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = async (product) => {
    try {
      setActionLoading(`add-${product.product_id}`);
      const res = await addToCart(product, 1);
      if (res.success) {
        showNotification(`Added "${product.product_name}" to your cart!`);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleMoveToCart = async (product) => {
    try {
      setActionLoading(`move-${product.product_id}`);
      await moveToCart(product);
      showNotification(`Moved "${product.product_name}" directly to your cart!`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (productId, productName) => {
    try {
      setActionLoading(`remove-${productId}`);
      await removeFromWishlist(productId);
      showNotification(`Removed "${productName}" from your wishlist.`, 'info');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading your wishlist...
      </div>
    );
  }

  const items = wishlist || [];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '1050px', margin: '0 auto' }}>
      {/* Top Banner & Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className={`badge badge-${targetDb}`}>DBMS: {targetDb.toUpperCase()}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {items.length} {items.length === 1 ? 'item saved' : 'items saved'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={26} color="var(--color-primary)" fill="var(--color-primary)" /> My Wishlist
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/products" className="btn-secondary-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem' }}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <Link to="/cart" className="btn-primary-block" style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.15rem' }}>
            <ShoppingCart size={16} /> View Cart <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: notification.type === 'info' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(21, 128, 61, 0.15)',
            border: `1px solid ${notification.type === 'info' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(21, 128, 61, 0.3)'}`,
            color: notification.type === 'info' ? '#60a5fa' : 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle size={18} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '4.5rem 1.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              margin: '0 auto 1.25rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}
          >
            <Heart size={38} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '440px', margin: '0 auto 1.75rem' }}>
            Explore our curated catalog and tap the heart icon on any product to save items you love for later.
          </p>
          <Link
            to="/products"
            className="btn-primary-block"
            style={{ width: 'auto', display: 'inline-flex', padding: '0.75rem 2rem', fontSize: '0.95rem' }}
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        /* Wishlist Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {items.map((item) => {
            const product = item.product || item;
            const inStock = product.stock_qty === undefined || product.stock_qty > 0;
            const price = parseFloat(product.mrp || 0).toFixed(2);

            return (
              <div
                key={item.wishlist_id || product.product_id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Product Image */}
                <div style={{ position: 'relative', height: '190px', backgroundColor: '#0f131a', overflow: 'hidden' }}>
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                    alt={product.product_name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Remove Button (Heart active state toggle) */}
                  <button
                    onClick={() => handleRemove(product.product_id, product.product_name)}
                    disabled={actionLoading === `remove-${product.product_id}`}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)',
                      transition: 'transform 0.15s ease'
                    }}
                    title="Remove from Wishlist"
                  >
                    <Heart size={18} fill="var(--color-primary)" />
                  </button>

                  {/* Category Pill */}
                  {product.category_name && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      {product.category_name}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
                    {product.brand || 'Brand'}
                  </div>

                  <Link
                    to={`/products/${product.product_id}`}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      lineHeight: 1.35,
                      marginBottom: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {product.product_name}
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      ₹{price}
                    </div>

                    <div>
                      {inStock ? (
                        <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                          In Stock {product.stock_qty !== undefined ? `(${product.stock_qty})` : ''}
                        </span>
                      ) : (
                        <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* Move Directly to Cart */}
                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={!inStock || actionLoading === `move-${product.product_id}`}
                      className="btn-primary-block"
                      style={{
                        padding: '0.65rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        fontSize: '0.86rem'
                      }}
                      title="Add to cart and remove from wishlist"
                    >
                      <ShoppingCart size={16} />
                      {actionLoading === `move-${product.product_id}` ? 'Moving...' : 'Move to Cart'}
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
                      {/* Add to Cart (keep in wishlist) */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock || actionLoading === `add-${product.product_id}`}
                        className="btn-secondary-outline"
                        style={{
                          padding: '0.55rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          fontSize: '0.82rem'
                        }}
                      >
                        <PackageCheck size={15} />
                        {actionLoading === `add-${product.product_id}` ? 'Adding...' : 'Add to Cart'}
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(product.product_id, product.product_name)}
                        disabled={actionLoading === `remove-${product.product_id}`}
                        style={{
                          padding: '0.55rem 0.75rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Remove from Wishlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

