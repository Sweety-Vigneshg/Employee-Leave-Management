import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { WorkOutline, ExitToApp, Dashboard } from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <WorkOutline sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Leave Management
          </Typography>
          
          <Box sx={{ ml: 4, display: 'flex', gap: 2 }}>
            <Button 
              component={Link} 
              to="/" 
              color="inherit"
              startIcon={<Dashboard />}
            >
              Dashboard
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'white', color: '#1976d2', width: 32, height: 32, fontSize: 14 }}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body1">
            {user.username} ({user.role})
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<ExitToApp />}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;