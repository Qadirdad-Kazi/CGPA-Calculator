import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Info,
  Login,
  PersonAdd,
  Dashboard,
  School,
  Logout,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Check if user is logged in (has token)
  const isLoggedIn = localStorage.getItem('token');
  const userEmail = localStorage.getItem('email');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setAnchorEl(null);
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home /> },
    { name: 'About', path: '/about', icon: <Info /> },
  ];

  const authItems = isLoggedIn 
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
      ]
    : [
        { name: 'Login', path: '/login', icon: <Login /> },
        { name: 'Register', path: '/register', icon: <PersonAdd /> },
      ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <School sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          CGPA Calculator
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.name} 
            button 
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              bgcolor: location.pathname === item.path ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.05)',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#667eea' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.name} 
              sx={{ 
                color: location.pathname === item.path ? '#667eea' : 'inherit',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal'
              }}
            />
          </ListItem>
        ))}
        <Divider />
        {authItems.map((item) => (
          <ListItem 
            key={item.name} 
            button 
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              bgcolor: location.pathname === item.path ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.05)',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#667eea' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.name} 
              sx={{ 
                color: location.pathname === item.path ? '#667eea' : 'inherit',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo and Brand */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => navigate('/')}
            >
              <School sx={{ 
                fontSize: 32, 
                color: '#667eea', 
                mr: 1 
              }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                CGPA Calculator
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: location.pathname === item.path ? '#667eea' : '#2c3e50',
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                      },
                      borderRadius: 2,
                      px: 2,
                      py: 1
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
                
                {isLoggedIn ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      startIcon={<Dashboard />}
                      onClick={() => navigate('/dashboard')}
                      sx={{
                        color: location.pathname === '/dashboard' ? '#667eea' : '#2c3e50',
                        fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal',
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.1)',
                          color: '#667eea',
                        },
                        borderRadius: 2,
                        px: 2,
                        py: 1
                      }}
                    >
                      Dashboard
                    </Button>
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      sx={{ color: '#667eea' }}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea' }}>
                        {userEmail?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Login />}
                      onClick={() => navigate('/login')}
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#5a6fd8',
                          bgcolor: 'rgba(102, 126, 234, 0.1)',
                        },
                        borderRadius: 2,
                        px: 2,
                        py: 1
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<PersonAdd />}
                      onClick={() => navigate('/register')}
                      sx={{
                        bgcolor: '#667eea',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#5a6fd8',
                        },
                        borderRadius: 2,
                        px: 2,
                        py: 1
                      }}
                    >
                      Register
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: '#667eea' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            border: 'none'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
          }
        }}
      >
        <MenuItem sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#667eea' }}>
              {userEmail?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {userEmail}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Student
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { navigate('/dashboard'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Dashboard fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Toolbar spacer to prevent content from hiding behind fixed navbar */}
      <Toolbar />
    </>
  );
}

export default Navbar;
