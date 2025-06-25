import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Badge } from '@mui/material';
import { WorkOutline, ExitToApp, Dashboard, Notifications } from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <WorkOutline sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Leave Management System
          </Typography>
          
          <Box sx={{ ml: 4, display: 'flex', gap: 2 }}>
            <Button 
              component={Link} 
              to={user.role === 'admin' ? "/admin" : "/employee"} 
              color="inherit"
              startIcon={<Dashboard />}
              sx={{ fontWeight: 500 }}
            >
              Dashboard
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Badge badgeContent={3} color="error">
            <Notifications sx={{ color: 'white', fontSize: 28 }} />
          </Badge>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ 
              bgcolor: 'white', 
              color: '#1976d2', 
              width: 36, 
              height: 36, 
              fontWeight: 'bold',
              fontSize: 16 
            }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
                {user.username}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: 'block' }}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Typography>
            </Box>
          </Box>
          
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<ExitToApp />}
            sx={{ fontWeight: 500 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;