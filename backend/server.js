// backend/server.js
require('dotenv').config(); // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

// Use process.env.MONGODB_URI, or fallback to local if it's not defined
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cgpa_app';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
