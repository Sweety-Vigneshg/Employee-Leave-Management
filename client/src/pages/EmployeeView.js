import React, { useState } from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import LeaveForm from '../components/LeaveForm';
import LeaveList from '../components/LeaveList';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const EmployeeView = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) {
    return (
      <Container>
        <Navbar />
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

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Apply for Leave
            </Typography>
            <LeaveForm onSuccess={handleLeaveSubmitSuccess} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              My Leave Applications
            </Typography>
            <LeaveList isAdmin={false} key={refreshKey} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default EmployeeView;