import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Profile from '../components/Profile';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

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

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 600, 
          mb: 3,
          pb: 2,
          borderBottom: '2px solid #f0f0f0'
        }}>
          My Profile
        </Typography>
        <Profile />
      </Container>
    </>
  );
};

export default ProfilePage;