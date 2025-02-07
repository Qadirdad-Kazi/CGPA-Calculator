// backend/routes/courses.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// same secret used for verifying token
const JWT_SECRET = 'YOUR_SECRET_KEY_HERE';

// Middleware to verify token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
}

// GET all courses for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('courses');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ courses: user.courses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ADD a new course
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { courseName, creditHours, gradePoints } = req.body;

    // Basic validation
    if (!courseName || !creditHours || !gradePoints) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // find user and push new course
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.courses.push({
      courseName,
      creditHours,
      gradePoints,
    });

    await user.save();

    return res
      .status(201)
      .json({ message: 'Course added successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
