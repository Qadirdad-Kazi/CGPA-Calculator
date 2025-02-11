import React, { useCallback, useEffect, useState, useMemo } from 'react';
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
import { API_URL } from './config'; // Ensure correct API URL import

function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [gpa, setGpa] = useState('');
  const token = localStorage.getItem('token');

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [token, fetchCourses]);

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

    const computedGradePoints = parsedCreditHours * parsedGpa;

    try {
      await axios.post(
        `${API_URL}/courses`,
        {
          courseName,
          creditHours: parsedCreditHours,
          gradePoints: computedGradePoints,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCourseName('');
      setCreditHours('');
      setGpa('');
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course');
    }
  };

  // Delete a course
  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(`${API_URL}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  // Calculate CGPA
  const cgpa = useMemo(() => {
    if (courses.length === 0) return null;
    const totalCreditHours = courses.reduce((sum, course) => sum + course.creditHours, 0);
    const totalGradePoints = courses.reduce((sum, course) => sum + course.gradePoints, 0);
    return totalCreditHours ? (totalGradePoints / totalCreditHours).toFixed(2) : null;
  }, [courses]);

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
                      <Typography variant="subtitle1">{course.courseName}</Typography>
                      <Typography variant="body2">
                        Credit Hours: {course.creditHours}
                      </Typography>
                      <Typography variant="body2">
                        GPA:{' '}
                        {course.creditHours && course.gradePoints
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
                  <Typography variant="body2">No courses added yet.</Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* CGPA Display */}
          {cgpa && (
            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h6" color="primary">
                Cumulative CGPA: {cgpa}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default Dashboard;
