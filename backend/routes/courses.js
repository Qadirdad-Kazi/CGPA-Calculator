const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// same secret used for verifying token (must be set via environment)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set in courses route. Authentication will fail.');
}

// Middleware to verify token
function authMiddleware(req, res, next) {
  console.log('Auth middleware called for:', req.method, req.path);
  console.log('Authorization header:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  console.log('Token extracted:', token ? 'present' : 'missing');

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.log('Token verified successfully for user:', decoded.userId);
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

    // Find user and push new course
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

    return res.status(201).json({ message: 'Course added successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE a course by its _id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Find the user by the ID attached by authMiddleware
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Remove the course with the matching _id from the courses array
    user.courses = user.courses.filter(
      (course) => course._id.toString() !== req.params.id
    );
    await user.save();
    return res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
