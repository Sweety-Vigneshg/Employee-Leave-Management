import React, { useState } from 'react';
import { Container, Box, Typography, Grid, Tabs, Tab } from '@mui/material';
import LeaveForm from '../components/LeaveForm';
import LeaveList from '../components/LeaveList';
import Profile from '../components/Profile'; // Add this import
import { useAuth } from '../context/AuthContext';

const EmployeeView = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  if (!user) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" color="error">
            Please log in to view this page
          </Typography>
        </Box>
      </Container>
    );
  }

  const handleLeaveSubmitSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Employee Dashboard
      </Typography>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Leave Management" />
        <Tab label="My Profile" />
      </Tabs>
      
      {activeTab === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              backgroundColor: 'white', 
              borderRadius: 2, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              p: 3,
              height: '100%'
            }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ 
                fontWeight: 600, 
                color: '#1976d2',
                mb: 3,
                pb: 1,
                borderBottom: '2px solid #f0f0f0'
              }}>
                Apply for Leave
              </Typography>
              <LeaveForm onSuccess={handleLeaveSubmitSuccess} />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              backgroundColor: 'white', 
              borderRadius: 2, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              p: 3,
              height: '100%'
            }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ 
                fontWeight: 600, 
                color: '#1976d2',
                mb: 3,
                pb: 1,
                borderBottom: '2px solid #f0f0f0'
              }}>
                My Leave Applications
              </Typography>
              <LeaveList isAdmin={false} key={refreshKey} />
            </Box>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 1 && (
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 2, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          p: 3
        }}>
          <Profile />
        </Box>
      )}
    </Container>
  );
};

export default EmployeeView;