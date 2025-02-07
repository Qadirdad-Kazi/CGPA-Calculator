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
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [gpa, setGpa] = useState('');
  const [cgpa, setCgpa] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchCourses();
  }, [token, navigate]);

  // Fetch all courses for the user
  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Add a new course
  const addCourse = async () => {
    if (!courseName || !creditHours || !gpa) {
      alert('Please fill out all fields');
      return;
    }
    const parsedCreditHours = parseFloat(creditHours);
    const parsedGpa = parseFloat(gpa);
    if (isNaN(parsedCreditHours) || isNaN(parsedGpa)) {
      alert('Credit Hours and GPA must be valid numbers');
      return;
    }
    // Calculate grade points for this course
    const computedGradePoints = parsedCreditHours * parsedGpa;

    try {
      await axios.post(
        'http://localhost:5000/api/courses',
        {
          courseName,
          creditHours: parsedCreditHours,
          gradePoints: computedGradePoints,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Clear form inputs
      setCourseName('');
      setCreditHours('');
      setGpa('');
      // Refresh courses list
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Error adding course');
    }
  };

  // Delete a course by its _id
  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh the course list after deletion
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course');
    }
  };

  // Calculate cumulative CGPA from all courses
  const calculateCGPA = () => {
    if (courses.length === 0) {
      setCgpa(null);
      return;
    }
    const totalCreditHours = courses.reduce(
      (sum, course) => sum + course.creditHours,
      0
    );
    const totalGradePoints = courses.reduce(
      (sum, course) => sum + course.gradePoints,
      0
    );
    if (totalCreditHours === 0) {
      setCgpa(null);
      return;
    }
    const computedCgpa = totalGradePoints / totalCreditHours;
    setCgpa(computedCgpa.toFixed(2));
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Dashboard
          </Typography>
          <Grid container spacing={4}>
            {/* Left Column: Course Form & CGPA Calculation */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Course Name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Credit Hours"
                  type="number"
                  value={creditHours}
                  onChange={(e) => setCreditHours(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="GPA"
                  type="number"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={addCourse}>
                  Add Course
                </Button>
                <Button variant="contained" color="secondary" onClick={calculateCGPA}>
                  Calculate CGPA
                </Button>
                {cgpa && (
                  <Typography variant="h6" color="primary">
                    Cumulative CGPA: {cgpa}
                  </Typography>
                )}
              </Box>
            </Grid>
            {/* Right Column: List of Existing Courses with Delete Option */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Your Courses
              </Typography>
              <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <Box
                      key={course._id}
                      sx={{
                        marginBottom: 1,
                        borderBottom: '1px solid #ccc',
                        paddingBottom: 1,
                      }}
                    >
                      <Typography variant="subtitle1">
                        {course.courseName}
                      </Typography>
                      <Typography variant="body2">
                        Credit Hours: {course.creditHours}
                      </Typography>
                      <Typography variant="body2">
                        GPA:{' '}
                        {(course.creditHours && course.gradePoints)
                          ? (course.gradePoints / course.creditHours).toFixed(2)
                          : '-'}
                      </Typography>
                      <Typography variant="body2">
                        Grade Points: {course.gradePoints}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ marginTop: 1 }}
                        onClick={() => deleteCourse(course._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">
                    No courses added yet.
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Dashboard;
