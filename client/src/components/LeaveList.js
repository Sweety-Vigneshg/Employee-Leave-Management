import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Close as CloseIcon,
  AccessTime as PendingIcon
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

  const calculateDuration = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    return end.diff(start, 'day') + 1;
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading leave data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (leaves.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>No leave applications found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {isAdmin && <TableCell>Employee</TableCell>}
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            {isAdmin && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {leaves.map((leave) => (
            <TableRow key={leave.id}>
              {isAdmin && (
                <TableCell>{leave.username || `User ${leave.user_id}`}</TableCell>
              )}
              <TableCell>{formatDate(leave.start_date)}</TableCell>
              <TableCell>{formatDate(leave.end_date)}</TableCell>
              <TableCell>
                {calculateDuration(leave.start_date, leave.end_date)} days
              </TableCell>
              <TableCell sx={{ maxWidth: 300 }}>{leave.reason}</TableCell>
              <TableCell>
                <Box 
                  className={`status-badge status-${leave.status}`}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  {leave.status === 'pending' && <PendingIcon fontSize="small" />}
                  {leave.status === 'approved' && <CheckIcon fontSize="small" />}
                  {leave.status === 'rejected' && <CloseIcon fontSize="small" />}
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </Box>
              </TableCell>
              {isAdmin && leave.status === 'pending' && (
                <TableCell>
                  <FormControl fullWidth size="small">
                    <InputLabel>Action</InputLabel>
                    <Select
                      value=""
                      onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                      label="Action"
                    >
                      <MenuItem value="approved">Approve</MenuItem>
                      <MenuItem value="rejected">Reject</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaveList;