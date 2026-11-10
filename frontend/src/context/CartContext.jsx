import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useDb } from './DbContext';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, role } = useAuth();
  const { targetDb } = useDb();

  const [cart, setCart] = useState({ items: [], items_total: 0, grand_total: 0 });
  const [loading, setLoading] = useState(true);

  // Helper to calculate totals for guest cart
  const calculateGuestTotals = (items) => {
    const items_total = items.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
    const grand_total = items.reduce((acc, item) => acc + (parseFloat(item.subtotal) || 0), 0);
    return {
      items,
      items_total,
      grand_total: parseFloat(grand_total.toFixed(2))
    };
  };

  // Helper to load guest cart from localStorage
  const getGuestCartFromStorage = () => {
    try {
      const saved = localStorage.getItem('pacific_guest_cart') || localStorage.getItem('pacific_guest_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) {
          return calculateGuestTotals(parsed.items);
        }
      }
    } catch (e) {
      console.error('Failed to parse guest cart from storage:', e);
    }
    return { items: [], items_total: 0, grand_total: 0 };
  };

  // Fetch cart data
  const refreshCart = useCallback(async () => {
    if (user && role === 'CUSTOMER') {
      try {
        setLoading(true);
        const res = await api.get('/cart');
        setCart(res.data || { items: [], items_total: 0, grand_total: 0 });
      } catch (err) {
        console.error('Failed to fetch user cart:', err);
        setCart({ items: [], items_total: 0, grand_total: 0 });
      } finally {
        setLoading(false);
      }
    } else if (!user) {
      // Guest user
      setLoading(false);
      setCart(getGuestCartFromStorage());
    } else {
      // Non-customer authenticated user (Seller, Employee, Admin)
      setLoading(false);
      setCart({ items: [], items_total: 0, grand_total: 0 });
    }
  }, [user, role, targetDb]);

  useEffect(() => {
    refreshCart();

    const handleCartUpdate = () => {
      if (!user) {
        setCart(getGuestCartFromStorage());
      }
    };

    window.addEventListener('pacific-cart-update', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('pacific-cart-update', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, [refreshCart, user]);

  // Add product to cart
  const addToCart = async (product, quantity = 1, attributes = null) => {
    if (!product || !product.product_id) return { success: false, error: 'Invalid product.' };

    const qtyToAdd = Math.max(1, parseInt(quantity) || 1);

    if (user) {
      if (role !== 'CUSTOMER') {
        alert('Cart operations are available for Customer accounts only.');
        return { success: false, error: 'Not a customer' };
      }

      try {
        const res = await api.post('/cart', {
          product_id: product.product_id,
          quantity: qtyToAdd,
          attributes
        });
        setCart(res.data);
        window.dispatchEvent(new Event('pacific-cart-update'));
        return { success: true, cart: res.data };
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to add item to cart.';
        alert(errorMsg);
        return { success: false, error: errorMsg };
      }
    } else {
      // Guest User cart logic
      const currentCart = getGuestCartFromStorage();
      const existingIdx = currentCart.items.findIndex(i => i.product_id === product.product_id);
      let updatedItems = [...currentCart.items];

      const unitPrice = parseFloat(product.mrp || 0);

      if (existingIdx !== -1) {
        const existing = updatedItems[existingIdx];
        const newQty = existing.quantity + qtyToAdd;
        const cappedQty = product.stock_qty ? Math.min(newQty, product.stock_qty) : newQty;
        updatedItems[existingIdx] = {
          ...existing,
          quantity: cappedQty,
          unit_price: unitPrice,
          subtotal: parseFloat((cappedQty * unitPrice).toFixed(2)),
          attributes: attributes || existing.attributes || null,
          product: { ...existing.product, ...product }
        };
      } else {
        const cappedQty = product.stock_qty ? Math.min(qtyToAdd, product.stock_qty) : qtyToAdd;
        updatedItems.push({
          cart_id: 'guest-cart',
          product_id: product.product_id,
          quantity: cappedQty,
          unit_price: unitPrice,
          subtotal: parseFloat((cappedQty * unitPrice).toFixed(2)),
          attributes: attributes || null,
          product
        });
      }

      const updatedCart = calculateGuestTotals(updatedItems);
      localStorage.setItem('pacific_guest_cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      window.dispatchEvent(new Event('pacific-cart-update'));
      return { success: true, cart: updatedCart };
    }
  };

  // Update quantity of an item in cart
  const updateQuantity = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;

    if (user && role === 'CUSTOMER') {
      try {
        const res = await api.put(`/cart/${productId}`, { quantity: newQty });
        setCart(res.data);
        window.dispatchEvent(new Event('pacific-cart-update'));
        return { success: true, cart: res.data };
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to update item quantity.');
        return { success: false };
      }
    } else if (!user) {
      // Guest user
      const currentCart = getGuestCartFromStorage();
      let updatedItems = [...currentCart.items];

      if (newQty <= 0) {
        updatedItems = updatedItems.filter(i => i.product_id !== productId);
      } else {
        const idx = updatedItems.findIndex(i => i.product_id === productId);
        if (idx !== -1) {
          const item = updatedItems[idx];
          const stock = item.product?.stock_qty;
          const cappedQty = stock ? Math.min(newQty, stock) : newQty;
          const unitPrice = parseFloat(item.unit_price || item.product?.mrp || 0);
          updatedItems[idx] = {
            ...item,
            quantity: cappedQty,
            subtotal: parseFloat((cappedQty * unitPrice).toFixed(2))
          };
        }
      }

      const updatedCart = calculateGuestTotals(updatedItems);
      localStorage.setItem('pacific_guest_cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      window.dispatchEvent(new Event('pacific-cart-update'));
      return { success: true, cart: updatedCart };
    }
  };

  // Remove single product from cart
  const removeFromCart = async (productId) => {
    if (user && role === 'CUSTOMER') {
      try {
        const res = await api.delete(`/cart/${productId}`);
        setCart(res.data);
        window.dispatchEvent(new Event('pacific-cart-update'));
        return { success: true, cart: res.data };
      } catch (err) {
        alert('Failed to remove item from cart.');
        return { success: false };
      }
    } else if (!user) {
      const currentCart = getGuestCartFromStorage();
      const updatedItems = currentCart.items.filter(i => i.product_id !== productId);
      const updatedCart = calculateGuestTotals(updatedItems);
      localStorage.setItem('pacific_guest_cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      window.dispatchEvent(new Event('pacific-cart-update'));
      return { success: true, cart: updatedCart };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (user && role === 'CUSTOMER') {
      try {
        const res = await api.delete('/cart/clear');
        setCart(res.data);
        window.dispatchEvent(new Event('pacific-cart-update'));
        return { success: true };
      } catch (err) {
        alert('Failed to clear cart.');
        return { success: false };
      }
    } else {
      localStorage.removeItem('pacific_guest_cart');
      const emptyCart = { items: [], items_total: 0, grand_total: 0 };
      setCart(emptyCart);
      window.dispatchEvent(new Event('pacific-cart-update'));
      return { success: true };
    }
  };

  // Synchronize guest cart into customer account after login/registration
  const syncGuestCart = async () => {
    try {
      const guestCart = getGuestCartFromStorage();
      if (!guestCart.items || guestCart.items.length === 0) return null;

      const payload = {
        items: guestCart.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          attributes: item.attributes || null
        }))
      };

      const res = await api.post('/cart/sync', payload);
      // Only clear storage once sync succeeded
      localStorage.removeItem('pacific_guest_cart');
      setCart(res.data);
      window.dispatchEvent(new Event('pacific-cart-update'));
      return res.data;
    } catch (err) {
      console.error('Failed to sync guest cart:', err);
      return null;
    }
  };

  const cartCount = cart?.items_total || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        syncGuestCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

