import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { dbSelectorMiddleware } from './middleware/dbSelectorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import logisticsRoutes from './routes/logisticsRoutes.js';
import { getAllCustomers, getAllSellers } from './services/dbAdapter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Configurable CORS for Production (Vercel, local dev, custom domain)
const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin requests
    if (!origin) return callback(null, true);

    // Allow configured origins, localhost, or any vercel.app / onrender.com deployment preview
    if (
      configuredOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.a.run.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    // Permissive fallback so frontend domain changes never break requests
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-database-type', 'x-requested-with']
}));

app.use(express.json());

// Database Selector middleware (attaches req.dbType from header, query, or body with safe allowlist)
app.use('/api', dbSelectorMiddleware);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/logistics', logisticsRoutes);

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await getAllCustomers(req.dbType);
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
});

app.get('/api/sellers', async (req, res) => {
  try {
    const sellers = await getAllSellers(req.dbType);
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sellers.' });
  }
});

// Root & Health check endpoints for Railway / Uptime monitors
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Pacific E-Commerce DBMS API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    activeTargetDatabase: req.dbType,
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if collocated
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 E-Commerce DBMS Backend server running on http://${HOST}:${PORT}`);
});
