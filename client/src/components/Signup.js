import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Box, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Grid
} from '@mui/material';
import { authAPI } from '../services/authAPI';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const checkPasswordStrength = (value) => {
    let strength = 0;
    if (value.length >= 8) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'error.main';
    if (passwordStrength === 1) return 'error.main';
    if (passwordStrength === 2) return 'warning.main';
    if (passwordStrength === 3) return 'success.main';
    if (passwordStrength === 4) return 'success.main';
    return 'text.secondary';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Medium';
    if (passwordStrength === 3) return 'Strong';
    if (passwordStrength === 4) return 'Very Strong';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (passwordStrength < 3) {
      setError('Password is too weak. Please use a stronger password');
      return;
    }
    
    try {
      await authAPI.register(username, password, role);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Registration failed. Username may already exist.');
      console.error('Registration error:', err);
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
            Create a new account
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
        
        {success && (
          <Box sx={{ 
            backgroundColor: '#e8f5e9', 
            color: '#4caf50', 
            p: 2, 
            mb: 2,
            borderRadius: 1
          }}>
            Account created successfully! Redirecting to login...
          </Box>
        )}
        
        {!success && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    label="Role"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="admin">Administrator</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                {password && (
                  <Box sx={{ mt: 1, ml: 1 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ color: getPasswordStrengthColor() }}
                    >
                      Strength: {getPasswordStrengthText()}
                    </Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: '#f5f5f5',
                  p: 1,
                  borderRadius: 1,
                  mb: 2
                }}>
                  <Box sx={{ 
                    width: '25%', 
                    height: 4, 
                    backgroundColor: passwordStrength > 0 ? getPasswordStrengthColor() : '#e0e0e0',
                    borderRadius: 2
                  }} />
                  <Box sx={{ 
                    width: '25%', 
                    height: 4, 
                    backgroundColor: passwordStrength > 1 ? getPasswordStrengthColor() : '#e0e0e0',
                    borderRadius: 2
                  }} />
                  <Box sx={{ 
                    width: '25%', 
                    height: 4, 
                    backgroundColor: passwordStrength > 2 ? getPasswordStrengthColor() : '#e0e0e0',
                    borderRadius: 2
                  }} />
                  <Box sx={{ 
                    width: '25%', 
                    height: 4, 
                    backgroundColor: passwordStrength > 3 ? getPasswordStrengthColor() : '#e0e0e0',
                    borderRadius: 2
                  }} />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 1, mb: 2 }}
                >
                  Create Account
                </Button>
              </Grid>
            </Grid>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Already have an account? <Link to="/login">Sign in</Link>
              </Typography>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default Signup;