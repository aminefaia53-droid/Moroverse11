/**
 * MoroVerse Backend Server
 * Founded & developed by Mohamed Amine El Amiri
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const mapRoutes = require('./routes/map');
const audioRoutes = require('./routes/audio');
const itineraryRoutes = require('./routes/itinerary');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Uploads directory ───────────────────────────────────────────────────────
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());

// Rate limiter: global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
});

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Parsers ──────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/chat', chatRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'MoroVerse',
    author: 'Mohamed Amine El Amiri',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[MoroVerse Error]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌙 MoroVerse Backend running on http://localhost:${PORT}`);
  console.log(`📚 Author: Mohamed Amine El Amiri`);
  console.log(`🗄️  DB: PostgreSQL + Drizzle ORM`);
  console.log(`🔐 Admin auth: JWT protected\n`);
});

module.exports = app;
