require('dotenv').config(); // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

const app = express();

// ✅ Fix CORS issue to allow frontend requests
app.use(cors({
  origin: "https://cgpa.qadirdadkazi.com",  // Replace with actual Netlify URL
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

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
