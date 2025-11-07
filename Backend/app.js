// Backend/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const adminPaymentRoutes = require('./routes/adminPaymentRoutes');
const mfaRoutes = require('./routes/mfaRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// ------------------------------
// Security & Middleware
// ------------------------------
app.use(helmet()); // Security headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ------------------------------
// CORS Configuration
// ------------------------------
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://localhost:3000';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors({
  origin: FRONTEND_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// ------------------------------
// Rate Limiter
// ------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ------------------------------
// Routes
// ------------------------------
app.get('/', (req, res) => {
  res.json({ message: 'Bank Portal API', version: '1.0.0', status: 'running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// MFA route
app.use('/api/mfa', mfaRoutes);

// Public & general routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/employees', employeeRoutes);

// Admin-only routes
app.use('/api/admin/payments', adminPaymentRoutes);

// Protected test route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Access granted',
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      accountNumber: req.user.accountNumber,
      role: req.user.role
    }
  });
});

// ------------------------------
// 404 Handler
// ------------------------------
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ------------------------------
// Error Handling Middleware
// ------------------------------
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

module.exports = app;