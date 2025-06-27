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
  Grid,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
  Fade,
  CircularProgress,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
  CheckCircle as CheckIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { authAPI } from '../services/authAPI';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Debug: Add console log to see if component loads
  React.useEffect(() => {
    console.log('Signup component loaded!');
  }, []);

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
    if (passwordStrength === 0) return theme.palette.error.main;
    if (passwordStrength === 1) return theme.palette.error.main;
    if (passwordStrength === 2) return theme.palette.warning.main;
    if (passwordStrength === 3) return theme.palette.success.main;
    if (passwordStrength === 4) return theme.palette.success.main;
    return theme.palette.text.secondary;
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Medium';
    if (passwordStrength === 3) return 'Strong';
    if (passwordStrength === 4) return 'Very Strong';
    return '';
  };

  const getPasswordStrengthProgress = () => {
    return (passwordStrength / 4) * 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!username || !password || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (passwordStrength < 3) {
      setError('Password is too weak. Please use a stronger password');
      setLoading(false);
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
    setLoading(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, #7c3aed 100%)`,
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '10%',
          width: 180,
          height: 180,
          borderRadius: '50%',
          backgroundColor: alpha('#ffffff', 0.08),
          animation: 'float 7s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-15px)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '8%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: alpha('#ffffff', 0.06),
          animation: 'float 9s ease-in-out infinite',
        }}
      />

      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Grid container spacing={4} alignItems="center">
            {/* Left side - Welcome content */}
            <Grid item xs={12} md={6}>
              <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h2" sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  background: 'linear-gradient(45deg, #ffffff 30%, #e0e7ff 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Join Our Team
                </Typography>
                <Typography variant="h5" sx={{ 
                  fontWeight: 400, 
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.4
                }}>
                  Create your Employee Leave Management account
                </Typography>
                

                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    backgroundColor: alpha('#ffffff', 0.1),
                    px: 2,
                    py: 1,
                    borderRadius: 2
                  }}>
                    <SecurityIcon />
                    <Typography variant="body2">Secure Access</Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    backgroundColor: alpha('#ffffff', 0.1),
                    px: 2,
                    py: 1,
                    borderRadius: 2
                  }}>
                    <PersonIcon />
                    <Typography variant="body2">User Friendly</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right side - Signup form */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 5,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
                }}
              >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Avatar 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      backgroundColor: theme.palette.primary.main,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <PersonAddIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: '#1e293b',
                    mb: 1
                  }}>
                    Create Account
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Join the Employee Leave Management System
                  </Typography>
                </Box>
                
                {/* Error Alert */}
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: 20
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Success Alert */}
                {success && (
                  <Alert 
                    severity="success"
                    icon={<CheckIcon />}
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: 20
                      }
                    }}
                  >
                    Account created successfully! Redirecting to login...
                  </Alert>
                )}
                
                {!success && (
                  <form onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Username"
                      variant="outlined"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: alpha('#f8fafc', 0.8),
                          '&:hover': {
                            backgroundColor: '#f8fafc'
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#ffffff'
                          }
                        }
                      }}
                    />

                    {/* Role Selection */}
                    <FormControl 
                      fullWidth 
                      required
                      margin="normal"
                      disabled={loading}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: alpha('#f8fafc', 0.8),
                          '&:hover': {
                            backgroundColor: '#f8fafc'
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#ffffff'
                          }
                        }
                      }}
                    >
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={role}
                        label="Role"
                        onChange={(e) => setRole(e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            {role === 'admin' ? <AdminIcon color="action" /> : <WorkIcon color="action" />}
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="employee">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WorkIcon fontSize="small" />
                            Employee
                          </Box>
                        </MenuItem>
                        <MenuItem value="admin">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AdminIcon fontSize="small" />
                            Administrator
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    
                    {/* Password Field */}
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              disabled={loading}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: alpha('#f8fafc', 0.8),
                          '&:hover': {
                            backgroundColor: '#f8fafc'
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#ffffff'
                          }
                        }
                      }}
                    />

                    {/* Password Strength Indicator */}
                    {password && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="caption" color="textSecondary">
                            Password Strength
                          </Typography>
                          <Chip 
                            label={getPasswordStrengthText()}
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(getPasswordStrengthColor(), 0.1),
                              color: getPasswordStrengthColor(),
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getPasswordStrengthProgress()}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha('#e0e0e0', 0.3),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getPasswordStrengthColor(),
                              borderRadius: 3
                            }
                          }}
                        />
                      </Box>
                    )}
                    
                    {/* Confirm Password Field */}
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      variant="outlined"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      error={confirmPassword && password !== confirmPassword}
                      helperText={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={handleToggleConfirmPasswordVisibility}
                              edge="end"
                              disabled={loading}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: alpha('#f8fafc', 0.8),
                          '&:hover': {
                            backgroundColor: '#f8fafc'
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#ffffff'
                          }
                        }
                      }}
                    />
                    
                    {/* Submit Button */}
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: 16,
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #1565c0 100%)`,
                          transform: 'translateY(-1px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                )}
                
                {/* Sign in link */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Already have an account?{' '}
                    <Link 
                      to="/login"
                      style={{ 
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Sign in here
                    </Link>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default Signup;