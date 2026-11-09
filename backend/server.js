import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Middleware setup
app.use(cors());
app.use(express.json());

// Database Selector middleware
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    activeTargetDatabase: req.dbType,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 E-Commerce DBMS Backend server running on http://localhost:${PORT}`);
});
