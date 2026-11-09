import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';

import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Addresses from './pages/Addresses';
import Profile from './pages/Profile';
import CustomerDashboard from './pages/CustomerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Wishlist from './pages/Wishlist';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
        Authenticating session...
      </div>
    );
  }

  if (!user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'EMPLOYEE') return <Navigate to="/employee/dashboard" replace />;
    if (role === 'SELLER') return <Navigate to="/seller/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
};

// Root Redirect Helper - always land on the flagship store catalog homepage
const HomeRedirect = () => {
  return <Navigate to="/products" replace />;
};

export default function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login or register page, render dedicated full auth window
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="jmart-app-frame">
      {/* Sliding JMART Sidebar Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="jmart-window">
        {/* Full-width Main Column with Top Header & Content Surface */}
        <div className="jmart-main-container">
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="jmart-content-surface">
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Customer Protected Routes */}
              <Route
                path="/customer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addresses"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <Addresses />
                  </ProtectedRoute>
                }
              />

              {/* Employee Protected Routes */}
              <Route
                path="/employee/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                    <EmployeeDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Seller Protected Routes */}
              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['SELLER']}>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* General Protected Routes */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Content Footer */}
            <Footer />

            {/* Global JMART Concierge & AI Support Chatbot */}
            <AIChatbot />
          </main>
        </div>
      </div>
    </div>
  );
}
