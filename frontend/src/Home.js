import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { School, Calculate, TrendingUp, Person } from '@mui/icons-material';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calculate sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Easy CGPA Calculation',
      description: 'Calculate your CGPA with our intuitive interface and accurate formulas.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#2e7d32' }} />,
      title: 'Track Progress',
      description: 'Monitor your academic performance and track improvements over time.'
    },
    {
      icon: <School sx={{ fontSize: 40, color: '#ed6c02' }} />,
      title: 'Course Management',
      description: 'Organize your courses, grades, and credits efficiently.'
    },
    {
      icon: <Person sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: 'Personal Dashboard',
      description: 'Access your personalized dashboard with detailed analytics.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box sx={{ 
          textAlign: 'center', 
          py: 12,
          color: 'white'
        }}>
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            CGPA Calculator
          </Typography>
          <Typography variant="h5" sx={{ 
            mb: 6, 
            opacity: 0.9,
            maxWidth: 600,
            mx: 'auto'
          }}>
            The smart way to calculate and track your academic performance
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: 'white', 
                color: '#667eea',
                '&:hover': { bgcolor: '#f5f5f5' },
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/about')}
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography variant="h3" component="h2" sx={{ 
            textAlign: 'center', 
            mb: 8, 
            color: 'white',
            fontWeight: 'bold'
          }}>
            Why Choose Our CGPA Calculator?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'translateY(-8px)' }
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          color: 'white'
        }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Ready to Start Calculating?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students who trust our CGPA Calculator
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/register')}
            sx={{ 
              bgcolor: 'white', 
              color: '#667eea',
              '&:hover': { bgcolor: '#f5f5f5' },
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Sign Up Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;

