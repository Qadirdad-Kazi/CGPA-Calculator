require('dotenv').config(); // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

const app = express();

// ✅ CORS: allow production, preview, and local frontends
const allowlist = [
  'http://localhost:3000',
  'https://kazicgpacalculator.netlify.app', // Netlify prod
  'https://cgpa.qadirdadkazi.com'           // Custom domain
];
const netlifyPreviewRegex = /^https?:\/\/[a-z0-9-]+--kazicgpacalculator\.netlify\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser tools
    if (allowlist.includes(origin) || netlifyPreviewRegex.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
}));

// Ensure preflight requests are handled
app.options('*', cors());

app.use(express.json());

// Mount your routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

// Optional: Define a default route
app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel!');
});

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cgpa_app';

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => console.log(err));

// ✅ Export the app for Vercel deployment
module.exports = app;
