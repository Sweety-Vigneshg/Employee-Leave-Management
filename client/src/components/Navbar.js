import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/authAPI';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  Badge, 
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  alpha,
  Container
} from '@mui/material';
import { 
  WorkOutline, 
  ExitToApp, 
  Dashboard, 
  Notifications, 
  Person,
  Settings,
  AdminPanelSettings,
  KeyboardArrowDown
} from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profile, setProfile] = useState(null);
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchor);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profileData = await authAPI.getProfile();
          setProfile(profileData);
        } catch (error) {
          console.error('Failed to fetch profile for navbar:', error);
          // Fallback to user data from auth context
          setProfile(null);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettingsClick = () => {
    navigate('/profile');
    handleClose();
  };

  const handleDashboardClick = () => {
    navigate(user.role === 'admin' ? "/admin" : "/employee");
  };

  // Helper functions to get user display data
  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (user?.full_name) return user.full_name;
    if (user?.name) return user.name;
    return user?.username || 'User';
  };

  const getDisplayEmail = () => {
    if (profile?.email) return profile.email;
    if (user?.email) return user.email;
    return 'No email provided';
  };

  const getDisplayPosition = () => {
    return profile?.position || 'Employee';
  };

  const getDisplayDepartment = () => {
    return profile?.department || 'Department';
  };

  const getInitials = (name) => {
    if (!name) return user?.username?.charAt(0)?.toUpperCase() || 'U';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getUserRole = () => {
    return user?.role || 'employee';
  };

  if (!user) return null;

  const displayName = getDisplayName();
  const displayEmail = getDisplayEmail();
  const userRole = getUserRole();

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e7ff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        height: 80
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          sx={{ 
            px: 0, 
            py: 1,
            minHeight: '80px !important',
            height: 80
          }}
        >
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 1.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              mr: 2
            }}>
              <WorkOutline sx={{ 
                color: theme.palette.primary.main, 
                fontSize: 28 
              }} />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b',
                  lineHeight: 1.2
                }}
              >
                Leave Management
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#64748b',
                  fontWeight: 500
                }}
              >
                Employee Portal
              </Typography>
            </Box>
            
            {/* Navigation Links */}
            <Box sx={{ ml: 6, display: 'flex', gap: 1 }}>
              <Button 
                onClick={handleDashboardClick}
                startIcon={<Dashboard />}
                sx={{ 
                  fontWeight: 600,
                  color: '#475569',
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }
                }}
              >
                Dashboard
              </Button>
            </Box>
          </Box>
          
          {/* Right Side - User Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Role Badge */}
            <Chip 
              icon={userRole === 'admin' ? <AdminPanelSettings /> : <Person />}
              label={userRole === 'admin' ? 'Administrator' : 'Employee'}
              size="small"
              sx={{ 
                backgroundColor: userRole === 'admin' 
                  ? alpha('#f59e0b', 0.1) 
                  : alpha('#10b981', 0.1),
                color: userRole === 'admin' ? '#f59e0b' : '#10b981',
                fontWeight: 600,
                border: userRole === 'admin' 
                  ? '1px solid #fde68a' 
                  : '1px solid #d1fae5',
                '& .MuiChip-icon': { 
                  color: userRole === 'admin' ? '#f59e0b' : '#10b981'
                }
              }}
            />
            
            {/* Position Badge (if available) */}
            {profile?.position && (
              <Chip 
                label={getDisplayPosition()}
                size="small"
                sx={{ 
                  backgroundColor: alpha('#3b82f6', 0.1),
                  color: '#3b82f6',
                  fontWeight: 500,
                  border: '1px solid #bfdbfe',
                  display: { xs: 'none', md: 'flex' }
                }}
              />
            )}
            
            {/* Notifications */}
            <IconButton
              onClick={handleNotificationMenu}
              sx={{ 
                p: 1.5,
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              <Badge 
                badgeContent={3} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 11
                  }
                }}
              >
                <Notifications sx={{ color: '#64748b', fontSize: 24 }} />
              </Badge>
            </IconButton>
            
            {/* User Profile */}
            <Button
              onClick={handleProfileMenu}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                textTransform: 'none',
                color: '#475569',
                px: 2,
                py: 1.5,
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              <Avatar sx={{ 
                bgcolor: theme.palette.primary.main,
                color: 'white',
                width: 36, 
                height: 36, 
                fontWeight: 'bold',
                fontSize: 14
              }}>
                {getInitials(displayName)}
              </Avatar>
              <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {displayName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {profile?.position ? `${profile.position} • ${displayEmail}` : displayEmail}
                </Typography>
              </Box>
              <KeyboardArrowDown sx={{ fontSize: 20, color: '#64748b' }} />
            </Button>
          </Box>
          
          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.15))',
                mt: 1.5,
                minWidth: 280,
                borderRadius: 2,
                border: '1px solid #e0e7ff',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                  border: '1px solid #e0e7ff',
                  borderBottom: 'none',
                  borderRight: 'none'
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* User Info Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  width: 48, 
                  height: 48, 
                  fontWeight: 'bold',
                  fontSize: 18,
                  mr: 2
                }}>
                  {getInitials(displayName)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {displayName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {displayEmail}
                  </Typography>
                </Box>
              </Box>
              
              {/* Profile badges in menu */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={userRole === 'admin' ? 'Administrator' : 'Employee'}
                  size="small"
                  sx={{ 
                    backgroundColor: userRole === 'admin' 
                      ? alpha('#f59e0b', 0.1) 
                      : alpha('#10b981', 0.1),
                    color: userRole === 'admin' ? '#f59e0b' : '#10b981',
                    fontWeight: 500,
                    fontSize: 11
                  }}
                />
                {profile?.position && (
                  <Chip 
                    label={getDisplayPosition()}
                    size="small"
                    sx={{ 
                      backgroundColor: alpha('#3b82f6', 0.1),
                      color: '#3b82f6',
                      fontWeight: 500,
                      fontSize: 11
                    }}
                  />
                )}
                {profile?.department && (
                  <Chip 
                    label={getDisplayDepartment()}
                    size="small"
                    sx={{ 
                      backgroundColor: alpha('#8b5cf6', 0.1),
                      color: '#8b5cf6',
                      fontWeight: 500,
                      fontSize: 11
                    }}
                  />
                )}
              </Box>
            </Box>
            
            <MenuItem 
              onClick={handleProfileClick}
              sx={{ 
                py: 1.5, 
                px: 3,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            >
              <Person sx={{ mr: 2, color: '#64748b' }} /> 
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  My Profile
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  View and edit profile information
                </Typography>
              </Box>
            </MenuItem>
            
            <MenuItem 
              onClick={handleSettingsClick}
              sx={{ 
                py: 1.5, 
                px: 3,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            >
              <Settings sx={{ mr: 2, color: '#64748b' }} /> 
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Settings
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Update password and preferences
                </Typography>
              </Box>
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                py: 1.5, 
                px: 3,
                color: '#ef4444',
                '&:hover': {
                  backgroundColor: alpha('#ef4444', 0.05)
                }
              }}
            >
              <ExitToApp sx={{ mr: 2 }} /> 
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Logout
              </Typography>
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={notificationOpen}
            onClose={handleNotificationClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.15))',
                mt: 1.5,
                minWidth: 320,
                maxWidth: 400,
                borderRadius: 2,
                border: '1px solid #e0e7ff',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 24,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                  border: '1px solid #e0e7ff',
                  borderBottom: 'none',
                  borderRight: 'none'
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* Notifications Header */}
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f1f5f9' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                Notifications
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                You have 3 unread notifications
              </Typography>
            </Box>
            
            {/* Sample Notifications */}
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <MenuItem sx={{ py: 2, px: 3, alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                    Leave request approved
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Your annual leave request has been approved
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#10b981', display: 'block', mt: 0.5 }}>
                    2 hours ago
                  </Typography>
                </Box>
              </MenuItem>
              
              <MenuItem sx={{ py: 2, px: 3, alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                    Profile update required
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Please update your emergency contact information
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#f59e0b', display: 'block', mt: 0.5 }}>
                    1 day ago
                  </Typography>
                </Box>
              </MenuItem>
              
              <MenuItem sx={{ py: 2, px: 3, alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                    System maintenance scheduled
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    The system will be offline for maintenance on Sunday
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                    3 days ago
                  </Typography>
                </Box>
              </MenuItem>
            </Box>
            
            <Divider />
            
            <MenuItem 
              onClick={handleNotificationClose}
              sx={{ 
                py: 1.5, 
                px: 3,
                justifyContent: 'center',
                color: theme.palette.primary.main,
                fontWeight: 600
              }}
            >
              View All Notifications
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;