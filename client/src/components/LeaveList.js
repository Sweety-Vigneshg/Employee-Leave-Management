import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  Typography, 
  Box, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Avatar,
  Stack,
  Divider,
  Alert,
  Skeleton,
  Paper
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Close as CloseIcon,
  AccessTime as PendingIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { leaveAPI } from '../services/leaveAPI';
import dayjs from 'dayjs';

const LeaveList = ({ isAdmin }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        const data = await leaveAPI.getLeaves();
        setLeaves(data);
        setError('');
      } catch (err) {
        setError('Failed to load leave data');
        console.error('Leave data error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaves();
  }, []);

  const handleStatusChange = async (leaveId, status) => {
    try {
      await leaveAPI.updateLeaveStatus(leaveId, status);
      setLeaves(leaves.map(leave => 
        leave.id === leaveId ? { ...leave, status } : leave
      ));
    } catch (err) {
      console.error('Status update error:', err);
      setError('Failed to update leave status');
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('MMM D, YYYY');
  };

  const formatDateRange = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    
    if (start.isSame(end, 'day')) {
      return start.format('MMM D, YYYY');
    }
    
    if (start.isSame(end, 'month')) {
      return `${start.format('MMM D')} - ${end.format('D, YYYY')}`;
    }
    
    return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`;
  };

  const calculateDuration = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    return end.diff(start, 'day') + 1;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: '#ff9800',
        backgroundColor: '#fff3e0',
        icon: <PendingIcon fontSize="small" />,
        label: 'Pending'
      },
      approved: {
        color: '#4caf50',
        backgroundColor: '#e8f5e8',
        icon: <CheckIcon fontSize="small" />,
        label: 'Approved'
      },
      rejected: {
        color: '#f44336',
        backgroundColor: '#ffebee',
        icon: <CloseIcon fontSize="small" />,
        label: 'Rejected'
      }
    };
    return configs[status] || configs.pending;
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      vacation: '#4caf50',
      sick: '#ff9800',
      personal: '#2196f3',
      bereavement: '#9c27b0',
      other: '#607d8b'
    };
    return colors[type] || '#607d8b';
  };

  const getLeaveTypeLabel = (type) => {
    const labels = {
      vacation: 'Vacation',
      sick: 'Sick Leave',
      personal: 'Personal Leave',
      bereavement: 'Bereavement',
      other: 'Other'
    };
    return labels[type] || 'Other';
  };

  const LoadingSkeleton = () => (
    <Stack spacing={2}>
      {[1, 2, 3].map((item) => (
        <Card key={item} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="80%" height={20} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (leaves.length === 0) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: 2
        }}
      >
        <CalendarIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No Leave Applications Found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {isAdmin ? 'No leave applications have been submitted yet.' : 'You haven\'t submitted any leave applications yet.'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {leaves.map((leave) => {
        const statusConfig = getStatusConfig(leave.status);
        const duration = calculateDuration(leave.start_date, leave.end_date);
        
        return (
          <Card 
            key={leave.id} 
            elevation={0}
            sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Left Section - Main Info */}
                <Grid item xs={12} md={8}>
                  <Stack spacing={2}>
                    {/* Header with Employee Info and Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isAdmin && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, backgroundColor: '#1976d2' }}>
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {leave.username || `User ${leave.user_id}`}
                            </Typography>
                          </Box>
                        )}
                        
                        {leave.leave_type && (
                          <Chip 
                            label={getLeaveTypeLabel(leave.leave_type)}
                            size="small"
                            sx={{ 
                              backgroundColor: getLeaveTypeColor(leave.leave_type),
                              color: 'white',
                              fontWeight: 500
                            }}
                          />
                        )}
                      </Box>
                      
                      <Chip
                        icon={statusConfig.icon}
                        label={statusConfig.label}
                        sx={{
                          backgroundColor: statusConfig.backgroundColor,
                          color: statusConfig.color,
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            color: statusConfig.color
                          }
                        }}
                      />
                    </Box>

                    {/* Date Range and Duration */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 18, color: '#666' }} />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formatDateRange(leave.start_date, leave.end_date)}
                        </Typography>
                      </Box>
                      
                      <Chip 
                        label={`${duration} ${duration === 1 ? 'day' : 'days'}`}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: '#1976d2',
                          color: '#1976d2',
                          fontWeight: 500
                        }}
                      />
                    </Box>

                    {/* Reason */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <DescriptionIcon sx={{ fontSize: 18, color: '#666' }} />
                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                          Reason
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#333',
                          backgroundColor: '#f8f9fa',
                          p: 2,
                          borderRadius: 1,
                          border: '1px solid #e9ecef',
                          lineHeight: 1.5
                        }}
                      >
                        {leave.reason}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                {/* Right Section - Actions */}
                {isAdmin && leave.status === 'pending' && (
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', justifyContent: 'center' }}>
                      <Divider orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />
                      <Divider sx={{ display: { xs: 'block', md: 'none' } }} />
                      
                      <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 500 }}>
                          Admin Actions
                        </Typography>
                        
                        <Stack spacing={1}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckIcon />}
                            onClick={() => handleStatusChange(leave.id, 'approved')}
                            sx={{ 
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: 2
                            }}
                          >
                            Approve
                          </Button>
                          
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<CloseIcon />}
                            onClick={() => handleStatusChange(leave.id, 'rejected')}
                            sx={{ 
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: 2
                            }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

export default LeaveList;