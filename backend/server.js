require('dotenv').config(); // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

const app = express();

app.use(cors());
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

// Only run app.listen() locally
if (process.env.VERCEL_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app wrapped in a function for Vercel
module.exports = (req, res) => app(req, res);
