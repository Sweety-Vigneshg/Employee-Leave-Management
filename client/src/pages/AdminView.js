import React, { useState } from 'react';
import { Container, Box, Typography, Button, Grid } from '@mui/material';
import LeaveList from '../components/LeaveList';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const AdminView = () => {
  const { user } = useAuth();
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <Container>
        <Navbar />
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" color="error">
            Access Denied - Admin privileges required
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setShowLeaveForm(!showLeaveForm)}
          >
            {showLeaveForm ? 'Hide Form' : 'Apply for Leave'}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {showLeaveForm && (
            <Grid item xs={12}>
              <LeaveForm 
                onSuccess={() => {
                  setShowLeaveForm(false);
                  window.location.reload();
                }} 
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              All Leave Applications
            </Typography>
            <LeaveList isAdmin={true} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminView;