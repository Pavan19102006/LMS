const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Use MongoDB with real auth system
const authRoutes = require('./routes/auth');
const authDemoRoutes = require('./routes/auth-demo');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const assignmentRoutes = require('./routes/assignments');

const app = express();

// Set trust proxy to 1 to trust the first hop from Vercel
app.set('trust proxy', 1);

// Variable to track database connection status
let isMongoConnected = false;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://lms-fullstack.vercel.app',
        'https://lms-education-platform.netlify.app',
        /\.vercel\.app$/,
        /\.netlify\.app$/,
        /\.replit\.dev$/,
        /\.replit\.co$/
      ]
    : [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        /localhost:\d+/,
        /\.replit\.dev$/,
        /\.replit\.co$/,
        /\.replit\.app$/
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Security middleware
app.use(helmet());

// Apply CORS with the defined options
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  isMongoConnected = true;
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Falling back to demo mode...');
  isMongoConnected = false;
});

console.log('Running with MongoDB database (with demo fallback)');

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'Demo Mode';
  res.json({ 
    status: 'OK', 
    message: 'LMS API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbStatus,
    mongoState: mongoose.connection.readyState,
    hasJwtSecret: !!process.env.JWT_SECRET
  });
});

// Routes - Use real authentication with MongoDB
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'LMS Server is running',
    timestamp: new Date().toISOString()
  });
});

// API-only mode - no static file serving
app.get('/', (req, res) => {
  res.json({ 
    message: 'LMS API Server is running!',
    mode: 'API Only',
    environment: process.env.NODE_ENV || 'development',
    endpoints: [
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/users/profile',
      'GET /api/courses',
      'GET /api/assignments'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`LMS API Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Mode: API Only (Backend)`);
  console.log(`Frontend should be deployed separately and connect to this API`);
});