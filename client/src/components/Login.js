import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  TextField, 
  Button, 
  Container, 
  Box, 
  Typography, 
  Paper,
  Avatar,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  alpha,
  Fade,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  Login as LoginIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon
} from '@mui/icons-material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Get the redirect location or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }
    
    const success = await login(username, password);
    if (success) {
      // Redirect to the originally requested page
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDemoLogin = (demoUsername, demoPassword) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
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
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: alpha('#ffffff', 0.1),
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          backgroundColor: alpha('#ffffff', 0.05),
          animation: 'float 8s ease-in-out infinite',
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
                  Welcome Back
                </Typography>
                <Typography variant="h5" sx={{ 
                  fontWeight: 400, 
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.4
                }}>
                  Access your Employee Leave Management System
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
                    <AdminIcon />
                    <Typography variant="body2">Admin Portal</Typography>
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
                    <WorkIcon />
                    <Typography variant="body2">Employee Access</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right side - Login form */}
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
                    <LoginIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: '#1e293b',
                    mb: 1
                  }}>
                    Sign In
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Enter your credentials to access your account
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
                
                {/* Login Form */}
                <form onSubmit={handleSubmit}>
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
                  
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                      'Sign In'
                    )}
                  </Button>
                </form>
                
                {/* Sign up link */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Don't have an account?{' '}
                    <Link 
                      to="/signup" 
                      state={{ from }}
                      style={{ 
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Sign up here
                    </Link>
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Demo Accounts
                  </Typography>
                </Divider>
                
                {/* Demo accounts */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Card 
                    sx={{ 
                      flex: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      },
                      border: '1px solid #e0e7ff'
                    }}
                    onClick={() => handleDemoLogin('admin', 'admin123@')}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <AdminIcon sx={{ color: '#7c3aed', mb: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Administrator
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        admin / admin123@
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    sx={{ 
                      flex: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      },
                      border: '1px solid #e0e7ff'
                    }}
                    onClick={() => handleDemoLogin('vicky', 'vicky123@')}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <WorkIcon sx={{ color: theme.palette.primary.main, mb: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Employee
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        vicky / vicky123@
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;