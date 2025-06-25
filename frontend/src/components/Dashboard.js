import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Grid, CircularProgress } from '@mui/material';
import LeaveForm from './LeaveForm';
import LeaveList from './LeaveList';
import { getMyLeaves } from '../services/leaveAPI';

const Dashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchLeaveBalance = async () => {
    try {
      const leaves = await getMyLeaves();
      const usedLeaves = leaves.reduce((sum, leave) => {
        return leave.status === 'approved' ? sum + leave.days_requested : sum;
      }, 0);
      setLeaveBalance(user.leave_balance - usedLeaves);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      fetchLeaveBalance();
    }
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Welcome, {user.name}
            </Typography>
            <Typography variant="body1">
              Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6" align="center">
                Leave Balance
              </Typography>
              <Typography variant="h3" align="center" color="primary">
                {leaveBalance} days
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
        <Tab label="Apply Leave" />
        <Tab label="My Leave History" />
        {user.role === 'manager' && <Tab label="Pending Approvals" />}
      </Tabs>

      <Box mt={2}>
        {tabIndex === 0 && <LeaveForm />}
        {tabIndex === 1 && <LeaveList />}
        {tabIndex === 2 && user.role === 'manager' && <LeaveList isManagerView={true} />}
      </Box>
    </Box>
  );
};

export default Dashboard;