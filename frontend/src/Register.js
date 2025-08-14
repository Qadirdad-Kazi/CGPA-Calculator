import React, { useState } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container, 
  Paper, 
  InputAdornment, 
  IconButton,
  Alert,
  Link
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff, 
  School,
  ArrowBack,
  PersonAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container maxWidth="sm">
        {/* Back to Home Button */}
        <Box sx={{ mb: 3, textAlign: 'left' }}>
          <Button 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Register Card */}
        <Paper elevation={24} sx={{ 
          p: 4,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: '#667eea', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
            }}>
              <PersonAdd sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 'bold',
              color: '#2c3e50',
              mb: 1
            }}>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join CGPA Calculator and start tracking your academic progress
            </Typography>
          </Box>

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Register Form */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea',
                },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea',
                },
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea',
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleRegister}
              disabled={loading}
              fullWidth
              size="large"
              sx={{
                bgcolor: '#667eea',
                color: 'white',
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  bgcolor: '#5a6fd8',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                },
                '&:disabled': {
                  bgcolor: '#bdbdbd',
                }
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Divider */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              my: 2,
              '&::before, &::after': {
                content: '""',
                flex: 1,
                borderBottom: '1px solid #e0e0e0',
              },
            }}>
              <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                OR
              </Typography>
            </Box>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            © 2024 CGPA Calculator. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Register;
