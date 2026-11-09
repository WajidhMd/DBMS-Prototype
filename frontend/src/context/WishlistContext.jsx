import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useDb } from './DbContext';
import { useCart } from './CartContext';
import api from '../services/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { targetDb } = useDb();
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to load guest wishlist from localStorage
  const getGuestWishlistFromStorage = () => {
    try {
      const saved = localStorage.getItem('jmart_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Normalize to items with product object
          return parsed.map(item => {
            if (item.product) return item;
            return {
              wishlist_id: item.wishlist_id || `guest-wsh-${item.product_id}`,
              product_id: item.product_id,
              product: item
            };
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse guest wishlist:', e);
    }
    return [];
  };

  const refreshWishlist = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const res = await api.get('/wishlist');
        setWishlist(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch user wishlist:', err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setWishlist(getGuestWishlistFromStorage());
    }
  }, [user, targetDb]);

  useEffect(() => {
    refreshWishlist();

    const handleWishlistUpdate = () => {
      if (!user) {
        setWishlist(getGuestWishlistFromStorage());
      }
    };

    window.addEventListener('jmart-wishlist-update', handleWishlistUpdate);
    window.addEventListener('storage', handleWishlistUpdate);

    return () => {
      window.removeEventListener('jmart-wishlist-update', handleWishlistUpdate);
      window.removeEventListener('storage', handleWishlistUpdate);
    };
  }, [refreshWishlist, user]);

  const isWishlisted = (productId) => {
    if (!productId) return false;
    return wishlist.some(item => (item.product_id === productId || item.product?.product_id === productId));
  };

  const addToWishlist = async (product) => {
    if (!product || !product.product_id) return { success: false };

    if (user) {
      try {
        const res = await api.post('/wishlist', { product_id: product.product_id });
        setWishlist(res.data);
        window.dispatchEvent(new Event('jmart-wishlist-update'));
        return { success: true };
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to add item to wishlist.');
        return { success: false };
      }
    } else {
      // Guest logic
      const items = getGuestWishlistFromStorage();
      const exists = items.some(i => i.product_id === product.product_id);
      if (!exists) {
        const newItem = {
          wishlist_id: `guest-wsh-${Date.now()}-${product.product_id}`,
          product_id: product.product_id,
          product: {
            product_id: product.product_id,
            product_name: product.product_name,
            brand: product.brand,
            mrp: parseFloat(product.mrp),
            stock_qty: product.stock_qty,
            image_url: product.image_url,
            category_name: product.category_name,
            is_active: product.is_active !== false
          }
        };
        const updated = [newItem, ...items];
        localStorage.setItem('jmart_wishlist', JSON.stringify(updated));
        setWishlist(updated);
        window.dispatchEvent(new Event('jmart-wishlist-update'));
      }
      return { success: true };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!productId) return { success: false };

    if (user) {
      try {
        const res = await api.delete(`/wishlist/${productId}`);
        setWishlist(res.data);
        window.dispatchEvent(new Event('jmart-wishlist-update'));
        return { success: true };
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to remove item from wishlist.');
        return { success: false };
      }
    } else {
      const items = getGuestWishlistFromStorage();
      const updated = items.filter(i => (i.product_id !== productId && i.product?.product_id !== productId));
      localStorage.setItem('jmart_wishlist', JSON.stringify(updated));
      setWishlist(updated);
      window.dispatchEvent(new Event('jmart-wishlist-update'));
      return { success: true };
    }
  };

  const toggleWishlist = async (product) => {
    if (!product || !product.product_id) return;
    if (isWishlisted(product.product_id)) {
      await removeFromWishlist(product.product_id);
    } else {
      await addToWishlist(product);
    }
  };

  const moveToCart = async (product) => {
    if (!product || !product.product_id) return;
    const res = await addToCart(product, 1);
    if (res.success) {
      await removeFromWishlist(product.product_id);
    }
  };

  const syncGuestWishlist = async () => {
    try {
      const guestItems = getGuestWishlistFromStorage();
      if (!guestItems || guestItems.length === 0) return null;

      const product_ids = guestItems.map(i => i.product_id || i.product?.product_id).filter(Boolean);
      const res = await api.post('/wishlist/sync', { product_ids });

      localStorage.removeItem('jmart_wishlist');
      setWishlist(res.data);
      window.dispatchEvent(new Event('jmart-wishlist-update'));
      return res.data;
    } catch (err) {
      console.error('Failed to sync guest wishlist:', err);
      return null;
    }
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        loading,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        moveToCart,
        refreshWishlist,
        syncGuestWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

