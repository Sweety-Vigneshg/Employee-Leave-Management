import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Tabs, 
  Tab,
  Paper,
  Avatar,
  Chip,
  Stack,
  Card,
  CardContent,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import LeaveForm from '../components/LeaveForm';
import LeaveList from '../components/LeaveList';
import Profile from '../components/Profile';
import { useAuth } from '../context/AuthContext';

const EmployeeView = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  if (!user) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        pt: 12, // Account for navbar height
        pb: 6
      }}>
        <Container maxWidth="md">
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              textAlign: 'center',
              backgroundColor: '#fff5f5',
              border: '1px solid #ffcdd2',
              borderRadius: 3
            }}
          >
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              backgroundColor: '#f44336', 
              mx: 'auto', 
              mb: 3 
            }}>
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" color="error" gutterBottom sx={{ fontWeight: 600 }}>
              Authentication Required
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Please log in to access your employee dashboard
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  const handleLeaveSubmitSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={300}>
          <Box>{children}</Box>
        </Fade>
      )}
    </div>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      pt: 12, // Add proper top padding to account for fixed navbar (80px navbar + 16px spacing)
      pb: 6
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Paper 
            elevation={0}
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              p: 4,
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                backgroundColor: alpha('#ffffff', 0.1),
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                backgroundColor: alpha('#ffffff', 0.05),
              }}
            />
            
            <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
              <Grid item>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    backgroundColor: alpha('#ffffff', 0.2),
                    color: 'white'
                  }}
                >
                  <DashboardIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Welcome back, {user.name || user.username || 'Employee'}!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  Manage your leave applications and profile settings
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2}>
                  <Chip 
                    icon={<PersonIcon />}
                    label="Employee"
                    sx={{ 
                      backgroundColor: alpha('#ffffff', 0.2),
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                  <Chip 
                    icon={<TrendingUpIcon />}
                    label="Active"
                    sx={{ 
                      backgroundColor: '#4caf50',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Navigation Tabs */}
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e0e7ff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' // Add subtle shadow for better separation
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
              backgroundColor: '#f8fafc',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 16,
                minHeight: 64,
                py: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              },
              '& .Mui-selected': {
                backgroundColor: 'white',
                color: theme.palette.primary.main
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab 
              icon={<CalendarIcon />} 
              iconPosition="start"
              label="Leave Management" 
              sx={{ flexDirection: 'row', gap: 1 }}
            />
            <Tab 
              icon={<PersonIcon />} 
              iconPosition="start"
              label="My Profile" 
              sx={{ flexDirection: 'row', gap: 1 }}
            />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={4}>
            {/* Leave Application Form */}
            <Grid item xs={12} lg={6}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid #e0e7ff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Section Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    pb: 2,
                    borderBottom: '2px solid #f1f5f9'
                  }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      mr: 2
                    }}>
                      <AssignmentIcon sx={{ 
                        color: theme.palette.primary.main,
                        fontSize: 24
                      }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Apply for Leave
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Submit a new leave application
                      </Typography>
                    </Box>
                  </Box>
                  
                  <LeaveForm onSuccess={handleLeaveSubmitSuccess} />
                </CardContent>
              </Card>
            </Grid>

            {/* Leave Applications List */}
            <Grid item xs={12} lg={6}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid #e0e7ff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Section Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    pb: 2,
                    borderBottom: '2px solid #f1f5f9'
                  }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      backgroundColor: alpha('#10b981', 0.1),
                      mr: 2
                    }}>
                      <CalendarIcon sx={{ 
                        color: '#10b981',
                        fontSize: 24
                      }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        My Applications
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Track your leave requests
                      </Typography>
                    </Box>
                  </Box>
                  
                  <LeaveList isAdmin={false} key={refreshKey} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  border: '1px solid #e0e7ff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Section Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    pb: 2,
                    borderBottom: '2px solid #f1f5f9'
                  }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      backgroundColor: alpha('#8b5cf6', 0.1),
                      mr: 2
                    }}>
                      <PersonIcon sx={{ 
                        color: '#8b5cf6',
                        fontSize: 24
                      }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Profile Settings
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Manage your personal information
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Profile />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default EmployeeView;