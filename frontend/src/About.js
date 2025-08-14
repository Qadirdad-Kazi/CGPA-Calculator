import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, School, Calculate, TrendingUp, Security, Support } from '@mui/icons-material';

function About() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Academic Excellence Team',
      role: 'Development Team',
      description: 'Dedicated to creating the best academic tools for students worldwide.'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Sign Up',
      description: 'Create your account with a simple registration process.'
    },
    {
      step: '2',
      title: 'Add Courses',
      description: 'Input your course details, grades, and credit hours.'
    },
    {
      step: '3',
      title: 'Calculate CGPA',
      description: 'Our system automatically calculates your CGPA using standard formulas.'
    },
    {
      step: '4',
      title: 'Track Progress',
      description: 'Monitor your academic performance over time with detailed analytics.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Button 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ color: 'white', mb: 2 }}
          >
            Back to Home
          </Button>
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            About CGPA Calculator
          </Typography>
          <Typography variant="h5" sx={{ 
            textAlign: 'center', 
            mt: 2,
            opacity: 0.9
          }}>
            Empowering students with accurate academic performance tracking
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Mission Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" sx={{ 
            textAlign: 'center', 
            mb: 4,
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Our Mission
          </Typography>
          <Typography variant="h6" sx={{ 
            textAlign: 'center', 
            maxWidth: 800,
            mx: 'auto',
            lineHeight: 1.6,
            color: '#34495e'
          }}>
            We believe that every student deserves access to accurate, easy-to-use tools for tracking their academic progress. 
            Our CGPA Calculator is designed to simplify the complex process of grade point calculation while providing 
            valuable insights into academic performance.
          </Typography>
        </Box>

        {/* How It Works */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" sx={{ 
            textAlign: 'center', 
            mb: 6,
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {howItWorks.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: '#667eea', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}>
                      {item.step}
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Grid */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" sx={{ 
            textAlign: 'center', 
            mb: 6,
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Key Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Calculate sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                    Accurate Calculations
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Our system uses industry-standard formulas to ensure accurate CGPA calculations. 
                  We support various grading scales and credit systems used by universities worldwide.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                    Progress Tracking
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Track your academic progress over time with detailed analytics, 
                  visual charts, and performance insights to help you stay motivated.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Security sx={{ fontSize: 40, color: '#ed6c02', mr: 2 }} />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                    Data Security
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Your academic data is protected with industry-standard security measures. 
                  We prioritize privacy and ensure your information remains confidential.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Support sx={{ fontSize: 40, color: '#9c27b0', mr: 2 }} />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                    24/7 Support
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Get help whenever you need it with our comprehensive support system. 
                  We're here to ensure you have the best experience possible.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" sx={{ 
            textAlign: 'center', 
            mb: 6,
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Our Team
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <School sx={{ fontSize: 40, color: '#667eea', mr: 2 }} />
                    <Box>
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                        {member.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {member.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ 
          textAlign: 'center',
          bgcolor: 'white',
          p: 6,
          borderRadius: 2,
          boxShadow: 3
        }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: '#7f8c8d' }}>
            Join thousands of students who are already using our CGPA Calculator
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: '#667eea',
                '&:hover': { bgcolor: '#5a6fd8' },
                px: 4,
                py: 1.5
              }}
            >
              Sign Up Now
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/login')}
              sx={{ 
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': { borderColor: '#5a6fd8', bgcolor: 'rgba(102, 126, 234, 0.1)' },
                px: 4,
                py: 1.5
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default About;
