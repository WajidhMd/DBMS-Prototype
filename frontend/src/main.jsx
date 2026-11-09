import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DbProvider } from './context/DbContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <DbProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </DbProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
