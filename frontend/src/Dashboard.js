// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [gradePoints, setGradePoints] = useState('');
  const [cgpa, setCgpa] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    // If no token, redirect to login
    if (!token) {
      navigate('/');
      return;
    }

    // Fetch user courses
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data.courses);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, [token, navigate]);

  // Calculate CGPA from stored courses
  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach((course) => {
      totalCredits += course.creditHours;
      totalGradePoints += course.gradePoints;
    });

    if (totalCredits === 0) {
      setCgpa(null);
      return;
    }

    const currentCgpa = totalGradePoints / totalCredits;
    setCgpa(currentCgpa.toFixed(2));
  };

  // Add a new course
  const addCourse = async () => {
    if (!courseName || !creditHours || !gradePoints) {
      alert('Please fill out all fields');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/courses',
        {
          courseName,
          creditHours,
          gradePoints,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear fields
      setCourseName('');
      setCreditHours('');
      setGradePoints('');

      // Refetch the courses
      const res = await axios.get('http://localhost:5000/api/courses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(res.data.courses);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Card variant="outlined" sx={{ padding: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Dashboard
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              marginBottom: 3,
            }}
          >
            <TextField
              label="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <TextField
              label="Credit Hours"
              type="number"
              value={creditHours}
              onChange={(e) => setCreditHours(e.target.value)}
            />
            <TextField
              label="Grade Points"
              type="number"
              value={gradePoints}
              onChange={(e) => setGradePoints(e.target.value)}
            />
            <Button variant="contained" onClick={addCourse}>
              Add Course
            </Button>
          </Box>

          <Button variant="contained" color="secondary" onClick={calculateCGPA}>
            Calculate CGPA
          </Button>

          {cgpa && (
            <Typography variant="h6" color="primary" sx={{ marginTop: 2 }}>
              Your CGPA is: {cgpa}
            </Typography>
          )}

          {/* Display all courses */}
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Your Courses:
          </Typography>
          <Box sx={{ marginTop: 1 }}>
            {courses.map((course, index) => (
              <Typography key={index}>
                {course.courseName} - CH: {course.creditHours}, GP:{' '}
                {course.gradePoints}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Dashboard;
