// backend/models/User.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  creditHours: { type: Number, required: true },
  gradePoints: { type: Number, required: true },
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Array of courses
  courses: [CourseSchema],
});

module.exports = mongoose.model('User', UserSchema);
