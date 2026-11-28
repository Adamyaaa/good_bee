import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import producerRoutes from './routes/producer.routes.js';
import dealerRoutes from './routes/dealer.routes.js';
import promoterRoutes from './routes/promoter.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import configRoutes from './routes/config.routes.js';
import mediaRoutes from './routes/media.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import { initPostgres, isConnected } from './db/pg.js';
import { seedNeonDatabase } from './db/seedCloud.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configured for both web frontend and mobile APK clients
const corsOrigin = process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*'
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : '*';

app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

// Serve local product & brand media so mobile clients can load /images_ref/* and /assets/*
app.use('/images_ref', express.static(path.resolve(__dirname, '../../client/public/images_ref')));
app.use('/assets', express.static(path.resolve(__dirname, '../../client/public/assets')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/producer', producerRoutes);
app.use('/api/v1/dealer', dealerRoutes);
app.use('/api/v1/promoter', promoterRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/delivery', deliveryRoutes);
app.use('/api/v1/config', configRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Good Bee Skincare Ecosystem API',
    database: isConnected() ? 'PostgreSQL (Connected & Synchronized)' : 'In-Memory Fallback (No DATABASE_URL)',
    persistent: isConnected(),
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root ping for cloud platform probes
app.get('/', (req, res) => {
  res.json({
    service: 'Good Bee Skincare Ecosystem API',
    status: 'ONLINE',
    health: '/api/health'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Good Bee Server Error]', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

async function startServer() {
  try {
    const connected = await initPostgres();
    if (connected) {
      await seedNeonDatabase();
    }
  } catch (err) {
    console.warn('[Database Init Catch]', err.message);
  }

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  GOOD BEE API Server running on port ${PORT}`);
    console.log(`  Database Mode: ${isConnected() ? 'PostgreSQL (Persistent)' : 'In-Memory Fallback'}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });
}

startServer();
