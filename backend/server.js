require('dotenv').config(); // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

const app = express();

// ✅ CORS config from env
// CORS_ALLOWLIST: comma-separated list of allowed origins
// CORS_PREVIEW_REGEX: optional regex source string for preview origins (e.g. Netlify previews)
const parsedEnvAllowlist = (process.env.CORS_ALLOWLIST || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

// Always include localhost for local development
const defaultAllowlist = ['http://localhost:3000'];
const allowlist = Array.from(new Set([...defaultAllowlist, ...parsedEnvAllowlist]));

// Build preview regex if provided, otherwise default to Netlify previews for this site name
const previewRegexSource = process.env.CORS_PREVIEW_REGEX || '^(https?:\\/\\/[a-z0-9-]+--kazicgpacalculator\\.netlify\\.app)$';
let previewRegex;
try {
  previewRegex = new RegExp(previewRegexSource);
} catch (e) {
  console.warn('Invalid CORS_PREVIEW_REGEX provided. Falling back to no preview regex.');
  previewRegex = null;
}

app.use(cors({
  origin: (origin, callback) => {
    console.log('CORS request from origin:', origin);
    if (!origin) return callback(null, true); // allow non-browser tools

    // Support wildcard via explicit '*'
    if (allowlist.includes('*')) {
      console.log('CORS allowed for all origins via *');
      return callback(null, true);
    }

    const isAllowlisted = allowlist.includes(origin);
    const matchesPreview = previewRegex ? previewRegex.test(origin) : false;

    if (isAllowlisted || matchesPreview) {
      console.log('CORS allowed for origin:', origin);
      return callback(null, true);
    }

    console.log('CORS blocked for origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Ensure preflight requests are handled
app.options('*', cors());

app.use(express.json());

// Add detailed request logging middleware
app.use((req, res, next) => {
  console.log('=== Request Details ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Path:', req.path);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  console.log('Headers:', req.headers);
  console.log('======================');
  next();
});

// Mount your routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint called');
  res.json({ 
    status: 'OK', 
    message: 'CGPA Calculator API is running',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Optional: Define a default route
app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel!');
});

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cgpa_app';

console.log('Attempting to connect to MongoDB...');
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

// ✅ Export the app for Vercel deployment
module.exports = app;
