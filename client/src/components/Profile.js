import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  Avatar,
  Paper,
  Stack,
  Divider,
  Chip
} from '@mui/material';
import { 
  Person, 
  Email, 
  Work, 
  Business, 
  Phone, 
  Lock,
  AccountCircle,
  Security,
  Edit,
  Save
} from '@mui/icons-material';
import { authAPI } from '../services/authAPI';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Profile form validation
  const profileValidationSchema = Yup.object({
    full_name: Yup.string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters')
      .max(50, 'Full name must not exceed 50 characters'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    position: Yup.string()
      .required('Position is required')
      .min(2, 'Position must be at least 2 characters')
      .max(50, 'Position must not exceed 50 characters'),
    department: Yup.string()
      .required('Department is required')
      .min(2, 'Department must be at least 2 characters')
      .max(50, 'Department must not exceed 50 characters'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
  });

  // Password form validation
  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  });

  // Profile form
  const profileFormik = useFormik({
    initialValues: {
      full_name: '',
      email: '',
      position: '',
      department: '',
      phone: ''
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      setProfileSubmitting(true);
      setError('');
      setSuccess('');
      
      try {
        // Call API to update profile in database
        const updatedProfile = await authAPI.updateProfile(values);
        
        // Update local state with response from database
        setProfile(updatedProfile);
        
        setSuccess('Profile updated successfully');
        
        // Reset form with updated values from database
        profileFormik.setValues({
          full_name: updatedProfile.full_name || '',
          email: updatedProfile.email || '',
          position: updatedProfile.position || '',
          department: updatedProfile.department || '',
          phone: updatedProfile.phone || ''
        });
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update profile');
        console.error('Profile update error:', err);
      } finally {
        setProfileSubmitting(false);
      }
    }
  });

  // Password form
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      setPasswordSubmitting(true);
      setError('');
      setSuccess('');
      
      try {
        await authAPI.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        });
        
        // Reset form after successful password change
        passwordFormik.resetForm();
        setSuccess('Password changed successfully');
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to change password');
        console.error('Password change error:', err);
      } finally {
        setPasswordSubmitting(false);
      }
    }
  });

  // Fetch profile data from database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Fetch fresh data from SQL database
        const data = await authAPI.getProfile();
        setProfile(data);
        
        // Populate form with database values
        profileFormik.setValues({
          full_name: data.full_name || '',
          email: data.email || '',
          position: data.position || '',
          department: data.department || '',
          phone: data.phone || ''
        });
        
        setError('');
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
  };

  const getInitials = (name) => {
    if (!name) return user?.username?.charAt(0)?.toUpperCase() || 'U';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 3,
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          position: 'absolute', 
          top: -50, 
          right: -50, 
          width: 200, 
          height: 200, 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          borderRadius: '50%' 
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: -30, 
          left: -30, 
          width: 150, 
          height: 150, 
          backgroundColor: 'rgba(255,255,255,0.05)', 
          borderRadius: '50%' 
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            color: 'white', 
            width: 80, 
            height: 80, 
            fontSize: 28,
            fontWeight: 'bold',
            mr: 3,
            border: '3px solid rgba(255,255,255,0.3)'
          }}>
            {getInitials(profile?.full_name)}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {profile?.full_name || user?.username || 'User'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={profile?.position || 'Employee'}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 500
                }}
              />
              <Chip 
                label={profile?.department || 'Department'}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 500
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Card variant="outlined" sx={{ borderRadius: 3, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{ 
              px: 3, 
              pt: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 16,
                minHeight: 48
              }
            }}
          >
            <Tab 
              icon={<AccountCircle sx={{ mr: 1 }} />} 
              label="Profile Information" 
              iconPosition="start"
            />
            <Tab 
              icon={<Security sx={{ mr: 1 }} />} 
              label="Change Password" 
              iconPosition="start"
            />
          </Tabs>
          
          <Divider />
          
          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}
              </Alert>
            )}
            
            {activeTab === 0 && (
              <form onSubmit={profileFormik.handleSubmit}>
                <Stack spacing={4}>
                  {/* Personal Information */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Person sx={{ mr: 1, color: '#1976d2', fontSize: 24 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Personal Information
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="full_name"
                          value={profileFormik.values.full_name}
                          onChange={profileFormik.handleChange}
                          onBlur={profileFormik.handleBlur}
                          error={profileFormik.touched.full_name && Boolean(profileFormik.errors.full_name)}
                          helperText={profileFormik.touched.full_name && profileFormik.errors.full_name}
                          variant="outlined"
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={profileFormik.values.email}
                          onChange={profileFormik.handleChange}
                          onBlur={profileFormik.handleBlur}
                          error={profileFormik.touched.email && Boolean(profileFormik.errors.email)}
                          helperText={profileFormik.touched.email && profileFormik.errors.email}
                          variant="outlined"
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={profileFormik.values.phone}
                          onChange={profileFormik.handleChange}
                          onBlur={profileFormik.handleBlur}
                          error={profileFormik.touched.phone && Boolean(profileFormik.errors.phone)}
                          helperText={profileFormik.touched.phone && profileFormik.errors.phone}
                          variant="outlined"
                          required
                          placeholder="+1234567890"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Work Information */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Work sx={{ mr: 1, color: '#1976d2', fontSize: 24 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Work Information
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Position"
                          name="position"
                          value={profileFormik.values.position}
                          onChange={profileFormik.handleChange}
                          onBlur={profileFormik.handleBlur}
                          error={profileFormik.touched.position && Boolean(profileFormik.errors.position)}
                          helperText={profileFormik.touched.position && profileFormik.errors.position}
                          variant="outlined"
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Department"
                          name="department"
                          value={profileFormik.values.department}
                          onChange={profileFormik.handleChange}
                          onBlur={profileFormik.handleBlur}
                          error={profileFormik.touched.department && Boolean(profileFormik.errors.department)}
                          helperText={profileFormik.touched.department && profileFormik.errors.department}
                          variant="outlined"
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Submit Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={profileSubmitting || !profileFormik.isValid}
                      size="large"
                      startIcon={profileSubmitting ? <CircularProgress size={20} /> : <Save />}
                      sx={{ 
                        minWidth: 200,
                        fontWeight: 600,
                        fontSize: 16,
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        backgroundColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#1565c0'
                        },
                        '&:disabled': {
                          backgroundColor: '#ccc'
                        }
                      }}
                    >
                      {profileSubmitting ? 'Updating Profile...' : 'Update Profile'}
                    </Button>
                  </Box>
                </Stack>
              </form>
            )}
            
            {activeTab === 1 && (
              <form onSubmit={passwordFormik.handleSubmit}>
                <Stack spacing={4}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Lock sx={{ mr: 1, color: '#1976d2', fontSize: 24 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Change Password
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          name="currentPassword"
                          type="password"
                          value={passwordFormik.values.currentPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                          error={passwordFormik.touched.currentPassword && Boolean(passwordFormik.errors.currentPassword)}
                          helperText={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword}
                          variant="outlined"
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          name="newPassword"
                          type="password"
                          value={passwordFormik.values.newPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                          error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                          helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
                          variant="outlined"
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          name="confirmPassword"
                          type="password"
                          value={passwordFormik.values.confirmPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                          error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                          helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                          variant="outlined"
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                      <Typography variant="body2">
                        <strong>Password Requirements:</strong>
                        <br />
                        • At least 8 characters long
                        <br />
                        • Contains uppercase and lowercase letters
                        <br />
                        • Contains at least one number
                        <br />
                        • Contains at least one special character (@$!%*?&)
                      </Typography>
                    </Alert>
                  </Paper>

                  {/* Submit Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={passwordSubmitting || !passwordFormik.isValid}
                      size="large"
                      startIcon={passwordSubmitting ? <CircularProgress size={20} /> : <Lock />}
                      sx={{ 
                        minWidth: 200,
                        fontWeight: 600,
                        fontSize: 16,
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        backgroundColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#1565c0'
                        },
                        '&:disabled': {
                          backgroundColor: '#ccc'
                        }
                      }}
                    >
                      {passwordSubmitting ? 'Changing Password...' : 'Change Password'}
                    </Button>
                  </Box>
                </Stack>
              </form>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;