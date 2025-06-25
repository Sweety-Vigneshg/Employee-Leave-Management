import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Container, Box, Typography, Paper } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect location or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    const success = await login(username, password);
    if (success) {
      // Redirect to the originally requested page
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" color="primary">
            Employee Leave System
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Sign in to your account
          </Typography>
        </Box>
        
        {error && (
          <Box sx={{ 
            backgroundColor: '#ffebee', 
            color: '#f44336', 
            p: 2, 
            mb: 2,
            borderRadius: 1
          }}>
            {error}
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don't have an account? <Link to="/signup" state={{ from }}>Sign up</Link>
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Demo Accounts
            </Typography>
            <Typography variant="body2">
              <strong>admin</strong> / <strong>admin123@</strong> (Admin)
            </Typography>
            <Typography variant="body2">
              <strong>vicky</strong> / <strong>vicky123@</strong> (Employee)
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;