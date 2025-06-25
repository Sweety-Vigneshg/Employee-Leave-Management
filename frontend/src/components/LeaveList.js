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
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { leaveAPI } from '../api';

const statusColors = {
  Pending: 'default',
  Approved: 'success',
  Rejected: 'error',
};

export default function LeaveList({ isAdmin = false }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const data = isAdmin 
          ? await leaveAPI.getAllLeaves(token) 
          : await leaveAPI.getEmployeeLeaves(token);
        setLeaves(data);
      } catch (error) {
        console.error('Error fetching leaves:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [isAdmin]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (leaveId, status) => {
    try {
      const token = localStorage.getItem('token');
      await leaveAPI.updateStatus(leaveId, status, token);
      setLeaves(leaves.map(leave => 
        leave.id === leaveId ? { ...leave, status } : leave
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (leaves.length === 0) {
    return (
      <Box my={4}>
        <Typography variant="body1" align="center">
          No leave applications found
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {isAdmin && <TableCell>Employee</TableCell>}
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              {isAdmin && <TableCell>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((leave) => (
                <TableRow key={leave.id}>
                  {isAdmin && (
                    <TableCell>{leave.employee_name || leave.employeeId}</TableCell>
                  )}
                  <TableCell>{new Date(leave.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(leave.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>{leave.leave_type || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      overflow: 'hidden'
                    }}>
                      {leave.reason}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={leave.status} 
                      color={statusColors[leave.status] || 'default'} 
                    />
                  </TableCell>
                  {isAdmin && leave.status === 'Pending' && (
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select
                          value=""
                          onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>Change Status</MenuItem>
                          <MenuItem value="Approved">Approve</MenuItem>
                          <MenuItem value="Rejected">Reject</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={leaves.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}