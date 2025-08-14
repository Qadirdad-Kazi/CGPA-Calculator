import React, { useCallback, useEffect, useState, useMemo } from 'react';
import api from './api';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Divider,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Grade as GradeIcon,
  Schedule as ScheduleIcon,
  
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [gpa, setGpa] = useState('');
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [addCourseDialog, setAddCourseDialog] = useState(false);
  // const [editingCourse, setEditingCourse] = useState(null);

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      showSnackbar('Failed to fetch courses', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [token, fetchCourses]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Add a new course
  const addCourse = async () => {
    if (!courseName || !creditHours || !gpa) {
      showSnackbar('Please fill out all fields', 'warning');
      return;
    }

    const parsedCreditHours = parseFloat(creditHours);
    const parsedGpa = parseFloat(gpa);

    if (isNaN(parsedCreditHours) || isNaN(parsedGpa)) {
      showSnackbar('Credit Hours and GPA must be valid numbers', 'warning');
      return;
    }

    if (parsedGpa < 0 || parsedGpa > 4) {
      showSnackbar('GPA must be between 0 and 4', 'warning');
      return;
    }

    const computedGradePoints = parsedCreditHours * parsedGpa;

    try {
      setLoading(true);
              await api.post(
          '/courses',
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
      setAddCourseDialog(false);
      fetchCourses();
      showSnackbar('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      showSnackbar('Failed to add course', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete a course
  const deleteCourse = async (courseId) => {
    try {
      setLoading(true);
              await api.delete(`/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
      showSnackbar('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      showSnackbar('Failed to delete course', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate CGPA and statistics
  const dashboardStats = useMemo(() => {
    if (courses.length === 0) return null;
    
    const totalCreditHours = courses.reduce((sum, course) => sum + course.creditHours, 0);
    const totalGradePoints = courses.reduce((sum, course) => sum + course.gradePoints, 0);
    const cgpa = totalCreditHours ? (totalGradePoints / totalCreditHours).toFixed(2) : 0;
    
    const averageGPA = courses.reduce((sum, course) => {
      const courseGPA = course.creditHours && course.gradePoints 
        ? (course.gradePoints / course.creditHours) 
        : 0;
      return sum + courseGPA;
    }, 0) / courses.length;

    const highPerformingCourses = courses.filter(course => {
      const courseGPA = course.creditHours && course.gradePoints 
        ? (course.gradePoints / course.creditHours) 
        : 0;
      return courseGPA >= 3.5;
    }).length;

    const needsImprovement = courses.filter(course => {
      const courseGPA = course.creditHours && course.gradePoints 
        ? (course.gradePoints / course.creditHours) 
        : 0;
      return courseGPA < 2.0;
    }).length;

    return {
      cgpa: parseFloat(cgpa),
      totalCreditHours,
      totalGradePoints,
      averageGPA: parseFloat(averageGPA.toFixed(2)),
      highPerformingCourses,
      needsImprovement,
      totalCourses: courses.length
    };
  }, [courses]);

  const getGradeColor = (gpa) => {
    if (gpa >= 3.5) return '#2e7d32';
    if (gpa >= 3.0) return '#1976d2';
    if (gpa >= 2.0) return '#ed6c02';
    return '#d32f2f';
  };

  const getGradeLabel = (gpa) => {
    if (gpa >= 3.5) return 'Excellent';
    if (gpa >= 3.0) return 'Good';
    if (gpa >= 2.0) return 'Average';
    return 'Needs Improvement';
  };

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('email');
  //   setToken(null);
  //   navigate('/');
  // };

  if (!token) return null;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8f9fa',
      py: 3
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ 
                fontWeight: 'bold',
                color: '#2c3e50',
                mb: 1
              }}>
                Academic Dashboard
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Track your academic progress and manage your courses
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddCourseDialog(true)}
              sx={{
                bgcolor: '#667eea',
                '&:hover': { bgcolor: '#5a6fd8' },
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Add Course
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        {dashboardStats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <TrendingUpIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {dashboardStats.cgpa}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Current CGPA
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                color: 'white',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <SchoolIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {dashboardStats.totalCourses}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Courses
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <ScheduleIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {dashboardStats.totalCreditHours}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Credit Hours
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #ed6c02 0%, #f57c00 100%)',
                color: 'white',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <GradeIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {dashboardStats.averageGPA}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Average GPA
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Performance Overview */}
        {dashboardStats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Performance Overview
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Excellent (3.5+)</Typography>
                      <Typography variant="body2" color="primary">
                        {dashboardStats.highPerformingCourses} courses
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(dashboardStats.highPerformingCourses / dashboardStats.totalCourses) * 100}
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0' }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Needs Improvement (&lt;2.0)</Typography>
                      <Typography variant="body2" color="error">
                        {dashboardStats.needsImprovement} courses
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(dashboardStats.needsImprovement / dashboardStats.totalCourses) * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        bgcolor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': { bgcolor: '#d32f2f' }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    CGPA Progress
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h2" sx={{ 
                      fontWeight: 'bold',
                      color: getGradeColor(dashboardStats?.cgpa || 0),
                      mb: 1
                    }}>
                      {dashboardStats?.cgpa || 0}
                    </Typography>
                    <Chip 
                      label={getGradeLabel(dashboardStats?.cgpa || 0)}
                      color={dashboardStats?.cgpa >= 3.5 ? 'success' : 
                             dashboardStats?.cgpa >= 3.0 ? 'primary' : 
                             dashboardStats?.cgpa >= 2.0 ? 'warning' : 'error'}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Courses List */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Your Courses
            </Typography>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Loading courses...
                </Typography>
              </Box>
            ) : courses.length > 0 ? (
              <List>
                {courses.map((course, index) => {
                  const courseGPA = course.creditHours && course.gradePoints
                    ? (course.gradePoints / course.creditHours).toFixed(2)
                    : 0;
                  
                  return (
                    <React.Fragment key={course._id}>
                      <ListItem sx={{ 
                        bgcolor: 'rgba(102, 126, 234, 0.02)',
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <Avatar sx={{ 
                            bgcolor: getGradeColor(courseGPA),
                            mr: 2,
                            width: 40,
                            height: 40
                          }}>
                            <SchoolIcon />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {course.courseName}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                              <Chip 
                                label={`${course.creditHours} Credits`}
                                size="small"
                                variant="outlined"
                                icon={<ScheduleIcon />}
                              />
                              <Chip 
                                label={`GPA: ${courseGPA}`}
                                size="small"
                                sx={{ 
                                  bgcolor: getGradeColor(courseGPA),
                                  color: 'white',
                                  fontWeight: 'bold'
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => deleteCourse(course._id)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < courses.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 6,
                color: 'text.secondary'
              }}>
                <SchoolIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No courses added yet
                </Typography>
                <Typography variant="body2">
                  Start by adding your first course to track your academic progress
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddCourseDialog(true)}
                  sx={{
                    mt: 2,
                    bgcolor: '#667eea',
                    '&:hover': { bgcolor: '#5a6fd8' }
                  }}
                >
                  Add Your First Course
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Add Course Dialog */}
      <Dialog 
        open={addCourseDialog} 
        onClose={() => setAddCourseDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#667eea', 
          color: 'white',
          fontWeight: 'bold'
        }}>
          Add New Course
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="e.g., Advanced Mathematics"
            />
            <TextField
              label="Credit Hours"
              type="number"
              value={creditHours}
              onChange={(e) => setCreditHours(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="e.g., 3"
              inputProps={{ min: 0, step: 0.5 }}
            />
            <TextField
              label="GPA"
              type="number"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="e.g., 3.5"
              inputProps={{ min: 0, max: 4, step: 0.01 }}
              helperText="GPA must be between 0 and 4"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setAddCourseDialog(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={addCourse}
            disabled={loading || !courseName || !creditHours || !gpa}
            sx={{
              bgcolor: '#667eea',
              '&:hover': { bgcolor: '#5a6fd8' },
              '&:disabled': { bgcolor: '#bdbdbd' }
            }}
          >
            {loading ? 'Adding...' : 'Add Course'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;
