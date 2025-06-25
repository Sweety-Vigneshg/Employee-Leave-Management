import React from 'react';
import { Container, Typography } from '@mui/material';
import LeaveList from '../components/LeaveList';

export default function AdminView() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        All Leave Applications
      </Typography>
      <LeaveList isAdmin={true} />
    </Container>
  );
}