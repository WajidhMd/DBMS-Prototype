import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DbProvider } from './context/DbContext';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DbProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </DbProvider>
    </BrowserRouter>
  </React.StrictMode>
);
