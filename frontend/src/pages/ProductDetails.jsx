import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import {
  ShoppingBag,
  ShoppingCart,
  Star,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Edit2,
  Trash2,
  Heart,
  Plus,
  Minus,
  Truck,
  MapPin,
  Bell,
  Check,
  Sparkles,
  HelpCircle,
  Camera,
  Layers,
  ShieldCheck,
  Clock,
  X,
  Bookmark
} from 'lucide-react';

const PRODUCT_COLORS = [
  { name: 'Midnight Black', hex: '#111111' },
  { name: 'Champagne Gold', hex: '#C6A15B' },
  { name: 'Titanium Silver', hex: '#9E9E9E' },
  { name: 'Royal Navy', hex: '#1E3A8A' }
];

const PRODUCT_VARIANTS = ['Standard', 'Pro Edition', 'Max Edition'];

export default function ProductDetails() {
  const { id } = useParams();
  const { user, role } = useAuth();
  const { targetDb } = useDb();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);

  // Variant States
  const [selectedColor, setSelectedColor] = useState(PRODUCT_COLORS[0]);
  const [selectedVariant, setSelectedVariant] = useState(PRODUCT_VARIANTS[0]);
  const [isSavedForLater, setIsSavedForLater] = useState(false);

  const getVariantOptions = () => {
    if (!product) return PRODUCT_VARIANTS;
    const cat = (product.category_name || '').toLowerCase();
    if (cat.includes('cloth') || cat.includes('fashion') || cat.includes('apparel') || cat.includes('shirt') || cat.includes('shoe')) {
      return ['S (Small)', 'M (Medium)', 'L (Large)', 'XL (Extra Large)', 'XXL'];
    }
    if (cat.includes('mobile') || cat.includes('phone') || cat.includes('electronic') || cat.includes('laptop') || cat.includes('computer')) {
      return ['128GB Storage', '256GB Storage', '512GB Storage', '1TB Pro Max'];
    }
    return ['Standard Edition', 'Pro Edition', 'Max Luxury Edition'];
  };

  useEffect(() => {
    if (product) {
      try {
        const saved = JSON.parse((localStorage.getItem('pacific_saved_for_later') || localStorage.getItem('pacific_saved_for_later')) || '[]');
        setIsSavedForLater(saved.some(s => s.product_id === product.product_id));
      } catch (_) {}
      const opts = getVariantOptions();
      if (!opts.includes(selectedVariant)) {
        setSelectedVariant(opts[0]);
      }
    }
  }, [product?.product_id]);

  const handleToggleSaveForLater = () => {
    if (!product) return;
    try {
      const saved = JSON.parse((localStorage.getItem('pacific_saved_for_later') || localStorage.getItem('pacific_saved_for_later')) || '[]');
      const exists = saved.some(s => s.product_id === product.product_id);
      let updated;
      if (exists) {
        updated = saved.filter(s => s.product_id !== product.product_id);
        setIsSavedForLater(false);
        setNotification({ message: `Removed "${product.product_name}" from Saved for Later`, type: 'info' });
      } else {
        const itemToSave = {
          product_id: product.product_id,
          product_name: product.product_name,
          brand: product.brand,
          mrp: product.mrp,
          image_url: product.image_url,
          quantity: 1
        };
        updated = [itemToSave, ...saved];
        setIsSavedForLater(true);
        setNotification({ message: `Saved "${product.product_name}" for later!`, type: 'success' });
      }
      localStorage.setItem('pacific_saved_for_later', JSON.stringify(updated));
      setTimeout(() => setNotification(null), 3500);
    } catch (_) {}
  };

  // Pincode Deliverability State
  const [pincodeInput, setPincodeInput] = useState('560001');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  // Stock Notification Modal State
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccessMsg, setNotifySuccessMsg] = useState('');
  const [notifySubmitting, setNotifySubmitting] = useState(false);

  // Product Q&A State
  const [qaList, setQaList] = useState([]);
  const [qaSearch, setQaSearch] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [submittingQA, setSubmittingQA] = useState(false);
  const [qaSuccessMsg, setQaSuccessMsg] = useState('');

  // Review Form state & Rich Media
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewDesc, setReviewDesc] = useState('');
  const [reviewPhoto, setReviewPhoto] = useState(null);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Complementary Bundle & Recently Viewed
  const [bundleProduct, setBundleProduct] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    fetchProductDetails();
    fetchQA();
    checkDeliverability('560001');
  }, [id, targetDb]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      const prodData = res.data || null;
      setProduct(prodData);

      const revRes = await api.get(`/reviews?product_id=${id}`);
      setReviews(revRes.data || []);

      // Update Recently Viewed in localStorage
      if (prodData) {
        try {
          const stored = JSON.parse((localStorage.getItem('pacific_recently_viewed') || localStorage.getItem('pacific_recently_viewed')) || '[]');
          const updated = [prodData, ...stored.filter(p => p.product_id !== prodData.product_id)].slice(0, 5);
          localStorage.setItem('pacific_recently_viewed', JSON.stringify(updated));
          setRecentlyViewed(updated.filter(p => p.product_id !== prodData.product_id));
        } catch (_) {}

        // Fetch bundle recommendation from catalog
        try {
          const allRes = await api.get('/products');
          const others = (allRes.data || []).filter(p => p.product_id !== prodData.product_id);
          if (others.length > 0) {
            setBundleProduct(others[Math.floor(Math.random() * others.length)]);
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error('Failed to load product details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQA = async () => {
    try {
      const res = await api.get(`/products/${id}/qa`);
      setQaList(res.data || []);
    } catch (_) {}
  };

  const checkDeliverability = async (codeToTest) => {
    const code = (codeToTest || pincodeInput).trim();
    if (!code || code.length !== 6) {
      setPincodeError('Please enter a valid 6-digit postal code.');
      return;
    }
    try {
      setPincodeLoading(true);
      setPincodeError('');
      const res = await api.get(`/logistics/pincode/${code}`);
      setPincodeResult(res.data);
    } catch (err) {
      setPincodeError(err.response?.data?.error || 'Pincode not deliverable.');
      setPincodeResult(null);
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleStockNotifySubmit = async (e) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) return;
    try {
      setNotifySubmitting(true);
      const res = await api.post(`/products/${id}/notify`, { email: notifyEmail });
      setNotifySuccessMsg(res.data?.message || 'Subscribed successfully!');
      setTimeout(() => {
        setShowNotifyModal(false);
        setNotifySuccessMsg('');
      }, 2500);
    } catch (err) {
      alert('Failed to register notification.');
    } finally {
      setNotifySubmitting(false);
    }
  };

  const handleAddQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    try {
      setSubmittingQA(true);
      const res = await api.post(`/products/${id}/qa`, { question: newQuestion });
      setQaList([res.data, ...qaList]);
      setNewQuestion('');
      setQaSuccessMsg('Your question has been posted!');
      setTimeout(() => setQaSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to submit question.');
    } finally {
      setSubmittingQA(false);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock_qty <= 0) {
      setNotification({ message: 'Product is currently out of stock.', type: 'error' });
      return;
    }
    const attributes = {
      color: selectedColor?.name,
      variant: selectedVariant
    };
    const res = await addToCart(product, quantity, attributes);
    if (res.success) {
      setNotification({ message: `Added ${quantity} × "${product.product_name}" (${selectedColor.name}, ${selectedVariant}) to cart!`, type: 'success' });
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handleAddBundleToCart = async () => {
    if (!bundleProduct) return;
    await addToCart(product, 1);
    await addToCart(bundleProduct, 1);
    setNotification({
      message: `Added bundle: "${product.product_name}" + "${bundleProduct.product_name}" to your cart with 10% combo savings!`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setReviewPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleStartEdit = (r) => {
    setEditingReviewId(r.review_id);
    setRating(r.rating);
    setReviewDesc(r.description);
    setReviewPhoto(r.photo_url || null);
    setReviewError('');
    setReviewSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setRating(5);
    setReviewDesc('');
    setReviewPhoto(null);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      alert('Review deleted.');
      fetchProductDetails();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete review.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!user || role !== 'CUSTOMER') {
      setReviewError('You must be logged in as a Customer to submit a review.');
      return;
    }

    try {
      setSubmittingReview(true);
      if (editingReviewId) {
        await api.put(`/reviews/${editingReviewId}`, {
          rating: parseInt(rating),
          description: reviewDesc,
          photo_url: reviewPhoto
        });
        setReviewSuccess('Review updated successfully!');
        setEditingReviewId(null);
      } else {
        await api.post('/reviews', {
          product_id: product.product_id,
          rating: parseInt(rating),
          description: reviewDesc,
          photo_url: reviewPhoto
        });
        setReviewSuccess('Review submitted successfully!');
      }
      setReviewDesc('');
      setReviewPhoto(null);
      fetchProductDetails();
    } catch (err) {
      setReviewError(err.response?.data?.error || 'A customer can only review products from delivered orders.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading product details...</div>;
  }

  if (!product) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn-secondary-outline" style={{ display: 'inline-flex', marginTop: '1rem' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  const myReview = user && reviews.find(r => r.customer_id === user?.ref_id);
  const filteredQA = qaList.filter(q =>
    q.question.toLowerCase().includes(qaSearch.toLowerCase()) ||
    (q.answer && q.answer.toLowerCase().includes(qaSearch.toLowerCase()))
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      {/* Main Product Hero Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem'
      }}>
        {/* Left: Product Image & Badges */}
        <div>
          <div style={{
            position: 'relative',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            minHeight: '340px',
            maxHeight: '400px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)'
          }}>
            {/* Top Deal Pill */}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 5 }}>
              <span style={{
                background: 'rgba(198, 161, 91, 0.2)',
                border: '1px solid var(--color-primary)',
                color: 'var(--color-primary)',
                padding: '0.25rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                ⚡ Lightning Deal · 15% OFF
              </span>
            </div>

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.product_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <div style={{ display: product.image_url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <ShoppingBag size={80} opacity={0.5} />
            </div>
          </div>

          {/* Trust Guarantees Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.6rem 0.4rem', textAlign: 'center', fontSize: '0.75rem' }}>
              <ShieldCheck size={18} color="var(--color-primary)" style={{ margin: '0 auto 0.2rem' }} />
              <div>100% Genuine</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.6rem 0.4rem', textAlign: 'center', fontSize: '0.75rem' }}>
              <Truck size={18} color="var(--color-primary)" style={{ margin: '0 auto 0.2rem' }} />
              <div>Free Delivery</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.6rem 0.4rem', textAlign: 'center', fontSize: '0.75rem' }}>
              <Clock size={18} color="var(--color-primary)" style={{ margin: '0 auto 0.2rem' }} />
              <div>7 Days Exchange</div>
            </div>
          </div>
        </div>

        {/* Right: Product Details, Variants, Deliverability & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-cyan">{product.category_name}</span>
              <span className="badge badge-success">Target: {targetDb.toUpperCase()}</span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>{product.product_name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.85rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              <span>Brand: <strong style={{ color: 'var(--text-primary)' }}>{product.brand}</strong></span>
              <span>•</span>
              <span>Seller: <strong style={{ color: 'var(--text-primary)' }}>{product.seller_name}</strong></span>
            </div>

            {/* Average Rating Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={17} fill={star <= Math.round(product.avg_rating || 0) ? '#f59e0b' : 'none'} />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.avg_rating || '4.8'} / 5.0</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>({reviews.length} customer ratings)</span>
            </div>

            {/* Price Presentation */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                ₹{parseFloat(product.mrp).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '1.15rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                ₹{(parseFloat(product.mrp) * 1.18).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.9rem' }}>Inclusive of all taxes</span>
            </div>

            {/* Stock Badges / Thresholds */}
            <div style={{ marginBottom: '1.25rem' }}>
              {product.stock_qty <= 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                    Currently Out of Stock
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNotifyModal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(198, 161, 91, 0.15)',
                      border: '1px solid var(--color-primary)',
                      color: 'var(--color-primary)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Bell size={13} /> Notify Me When In Stock
                  </button>
                </div>
              ) : product.stock_qty <= 5 ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid #f59e0b',
                  color: '#f59e0b',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}>
                  ⚡ Only {product.stock_qty} left in stock - order soon!
                </span>
              ) : (
                <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                  In Stock ({product.stock_qty} units ready to dispatch)
                </span>
              )}
            </div>

            {/* Product Variants: Colors */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Color: <strong style={{ color: 'var(--text-primary)' }}>{selectedColor.name}</strong>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {PRODUCT_COLORS.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: selectedColor.name === c.name ? '3px solid var(--color-primary)' : '2px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      outline: 'none',
                      boxShadow: selectedColor.name === c.name ? '0 0 0 2px var(--color-gold-soft)' : 'none'
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Product Variants: Editions / Capacities */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Variant / Size / Storage:
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {getVariantOptions().map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      backgroundColor: selectedVariant === v ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                      color: selectedVariant === v ? '#000' : 'var(--text-primary)',
                      border: `1px solid ${selectedVariant === v ? 'var(--color-primary)' : 'var(--border-color)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Pincode Deliverability Check */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <MapPin size={16} color="var(--color-primary)" /> Delivery Availability & Speed
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  style={{
                    flex: 1,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => checkDeliverability()}
                  disabled={pincodeLoading}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.4rem 0.9rem',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  {pincodeLoading ? 'Checking...' : 'Check'}
                </button>
              </div>

              {pincodeError && <div style={{ color: '#ef4444', fontSize: '0.8rem' }}>{pincodeError}</div>}
              {pincodeResult && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <div style={{ color: '#22c55e', fontWeight: 600 }}>
                    ✓ Deliverable to {pincodeResult.city}, {pincodeResult.state}
                  </div>
                  <div>Estimated delivery by <strong>{pincodeResult.estimatedDeliveryDate}</strong></div>
                  <div style={{ color: 'var(--color-primary)', fontSize: '0.78rem' }}>
                    ⚡ {pincodeResult.fastestSpeed} · Cash on Delivery available
                  </div>
                </div>
              )}
            </div>

            {/* Notification Banner */}
            {notification && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: notification.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(21, 128, 61, 0.15)',
                  border: `1px solid ${notification.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(21, 128, 61, 0.3)'}`,
                  color: notification.type === 'error' ? '#f87171' : 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.88rem'
                }}
              >
                {notification.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                <span>{notification.message}</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity:</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.stock_qty <= 0}
                  style={{ padding: '0.4rem 0.75rem', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}
                  title="Decrease Quantity"
                >
                  <Minus size={13} />
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock_qty || 99}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(val, product.stock_qty || 99)));
                  }}
                  style={{ width: '45px', textAlign: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem' }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min((product.stock_qty || 99), quantity + 1))}
                  disabled={Boolean(product.stock_qty && quantity >= product.stock_qty) || product.stock_qty <= 0}
                  style={{ padding: '0.4rem 0.75rem', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}
                  title="Increase Quantity"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr auto auto', gap: '0.65rem', marginTop: '1rem' }}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock_qty <= 0}
              className="btn-primary-block"
              style={{ padding: '0.85rem', marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <ShoppingCart size={18} /> {product.stock_qty <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              style={{
                padding: '0.85rem 1.15rem',
                backgroundColor: isWishlisted(product.product_id) ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card)',
                border: `1px solid ${isWishlisted(product.product_id) ? 'var(--color-primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-sm)',
                color: isWishlisted(product.product_id) ? 'var(--color-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title={isWishlisted(product.product_id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={18} fill={isWishlisted(product.product_id) ? 'var(--color-primary)' : 'none'} color="var(--color-primary)" />
              <span>{isWishlisted(product.product_id) ? 'Wishlisted' : 'Wishlist'}</span>
            </button>

            <button
              onClick={handleToggleSaveForLater}
              style={{
                padding: '0.85rem 1.15rem',
                backgroundColor: isSavedForLater ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card)',
                border: `1px solid ${isSavedForLater ? 'var(--color-primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-sm)',
                color: isSavedForLater ? 'var(--color-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title={isSavedForLater ? 'Remove from Saved' : 'Save for Later'}
            >
              <Bookmark size={18} fill={isSavedForLater ? 'var(--color-primary)' : 'none'} color="var(--color-primary)" />
              <span>{isSavedForLater ? 'Saved' : 'Save for Later'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {bundleProduct && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--color-primary)" /> Frequently Bought Together
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src={product.image_url} alt={product.product_name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px', background: '#111' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>+</span>
              <img src={bundleProduct.image_url} alt={bundleProduct.product_name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px', background: '#111' }} />
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                {product.product_name} + {bundleProduct.product_name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ₹{(parseFloat(product.mrp) + parseFloat(bundleProduct.mrp) * 0.9).toFixed(2)}
                </span>
                <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ₹{(parseFloat(product.mrp) + parseFloat(bundleProduct.mrp)).toFixed(2)}
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Save 10% on Combo</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddBundleToCart}
              className="btn-primary-block"
              style={{ width: 'auto', padding: '0.65rem 1.25rem', marginTop: 0 }}
            >
              Add Both to Cart
            </button>
          </div>
        </div>
      )}

      {/* Product Q&A Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={20} color="var(--color-primary)" /> Customer Questions & Answers
          </h2>
          <input
            type="text"
            placeholder="Search questions & answers..."
            value={qaSearch}
            onChange={(e) => setQaSearch(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              minWidth: '240px'
            }}
          />
        </div>

        {/* Post a Question Form */}
        <form onSubmit={handleAddQuestionSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Have a question? Ask the seller or PACIFIC verified buyers..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            style={{
              flex: 1,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.55rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.88rem'
            }}
          />
          <button
            type="submit"
            disabled={submittingQA || !newQuestion.trim()}
            style={{
              background: 'var(--color-primary)',
              color: '#000',
              border: 'none',
              padding: '0.55rem 1.15rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {submittingQA ? 'Posting...' : 'Ask Question'}
          </button>
        </form>

        {qaSuccessMsg && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.6rem 0.85rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {qaSuccessMsg}
          </div>
        )}

        {/* Q&A List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredQA.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No questions found. Be the first to ask!</p>
          ) : (
            filteredQA.map(qa => (
              <div key={qa.id} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Q:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{qa.question}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', paddingLeft: '0.2rem' }}>
                  <span style={{ fontWeight: 800, color: '#22c55e', fontSize: '0.9rem' }}>A:</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.4 }}>{qa.answer}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', paddingLeft: '1.25rem' }}>
                  Answered by <strong>{qa.answered_by}</strong> {qa.is_seller && '· Verified Seller'} · {qa.date}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Customer Reviews Section with Rich Media Photo Upload */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={20} color="var(--color-primary)" /> Verified Customer Reviews
        </h2>

        {role === 'CUSTOMER' && (
          <div style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {editingReviewId ? 'Edit Your Review' : myReview ? 'Your Submitted Review' : 'Write a Product Review with Photos'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Share your genuine feedback and upload photos of your product in use!
            </p>

            {reviewError && <div className="error-banner">{reviewError}</div>}
            {reviewSuccess && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.65rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {reviewSuccess}
              </div>
            )}

            {(!myReview || editingReviewId) && (
              <form onSubmit={handleSubmitReview}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Rating (1 to 5 Stars)</label>
                  <select className="form-input" value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value="3">⭐⭐⭐ (3 - Average)</option>
                    <option value="2">⭐⭐ (2 - Below Average)</option>
                    <option value="1">⭐ (1 - Poor)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Review Comment</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Share your experience with build quality, battery, performance, etc..."
                    value={reviewDesc}
                    onChange={(e) => setReviewDesc(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Rich Media Photo Upload */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Camera size={15} color="var(--color-primary)" /> Attach Product Photo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}
                  />
                  {reviewPhoto && (
                    <div style={{ marginTop: '0.5rem', position: 'relative', display: 'inline-block' }}>
                      <img src={reviewPhoto} alt="Review Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-primary)' }} />
                      <button
                        type="button"
                        onClick={() => setReviewPhoto(null)}
                        style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn-primary-block" style={{ width: 'auto', padding: '0.6rem 1.25rem', marginTop: 0 }} disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : editingReviewId ? 'Save Changes' : 'Submit Review'}
                  </button>
                  {editingReviewId && (
                    <button type="button" onClick={handleCancelEdit} className="btn-secondary-outline" style={{ width: 'auto' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No customer reviews yet for this product.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map(r => (
              <div
                key={r.review_id}
                style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{r.customer_name}</strong>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Verified Purchase</span>
                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={14} fill={star <= r.rating ? '#f59e0b' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.review_date}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 0.5rem 0' }}>{r.description}</p>
                {r.photo_url && (
                  <img src={r.photo_url} alt="Customer review visual" style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '0.3rem' }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed Carousel */}
      {recentlyViewed.length > 0 && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
            Recently Viewed Products
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {recentlyViewed.map(item => (
              <Link
                key={item.product_id}
                to={`/products/${item.product_id}`}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.2s ease'
                }}
              >
                <img src={item.image_url} alt={item.product_name} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.product_name}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                  ₹{Number(item.mrp).toLocaleString('en-IN')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stock Notification Modal */}
      {showNotifyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            maxWidth: '420px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowNotifyModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Bell size={22} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Stock Alert Subscription</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Get an instant notification email as soon as <strong>{product.product_name}</strong> is back in stock at JMART!
            </p>

            {notifySuccessMsg ? (
              <div style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                {notifySuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleStockNotifySubmit}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    padding: '0.65rem 0.85rem',
                    color: '#fff',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    marginBottom: '1rem'
                  }}
                />
                <button
                  type="submit"
                  disabled={notifySubmitting}
                  className="btn-primary-block"
                  style={{ padding: '0.75rem' }}
                >
                  {notifySubmitting ? 'Registering...' : 'Notify Me'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
