// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// A secret key for JWT (must be set via environment)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set. Please configure it in your environment.');
  console.error('Login will fail without a JWT secret.');
}

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      courses: [],
    });

    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt for email:', req.body.email);
    const startTime = Date.now();
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Looking up user in database...');
    // find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res
        .status(400)
        .json({ message: 'Invalid email or password' });
    }

    console.log('User found, comparing password...');
    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res
        .status(400)
        .json({ message: 'Invalid email or password' });
    }

    console.log('Password matched, creating token...');
    // create token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    const endTime = Date.now();
    console.log(`Login successful for user: ${email} (took ${endTime - startTime}ms)`);
    return res.status(200).json({ token, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
