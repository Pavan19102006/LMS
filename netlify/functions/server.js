const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const authRoutes = require('../../server/routes/auth');
const courseRoutes = require('../../server/routes/courses');
const userRoutes = require('../../server/routes/users');
const assignmentRoutes = require('../../server/routes/assignments');
const app = express();
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'http:
      'http:
      process.env.FRONTEND_URL,
      /\.netlify\.app$/,
      /\.netlify\.com$/
    ];
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      return allowed.test(origin);
    });
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LMS API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LMS API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint working',
    mongoUri: process.env.MONGODB_URI ? 'MONGODB_URI is set' : 'MONGODB_URI is missing',
    jwtSecret: process.env.JWT_SECRET ? 'JWT_SECRET is set' : 'JWT_SECRET is missing',
    mongooseConnection: mongoose.connection.readyState,
    mongooseStates: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }
  });
});
let isConnected = false;
const connectDB = async () => {
  if (isConnected) {
    return;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
const ensureDBConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
};
app.use('/api', ensureDBConnection);
app.use('/auth', ensureDBConnection);
app.use('/courses', ensureDBConnection);
app.use('/users', ensureDBConnection);
app.use('/assignments', ensureDBConnection);
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/users', userRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
module.exports.handler = serverless(app);
