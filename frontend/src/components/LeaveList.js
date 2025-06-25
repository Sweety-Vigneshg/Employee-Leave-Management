import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { getMyLeaves, getPendingLeaves, updateLeaveStatus } from '../services/leaveAPI';
import { format } from 'date-fns';

const LeaveList = ({ isManagerView = false }) => {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [comments, setComments] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = isManagerView 
          ? await getPendingLeaves() 
          : await getMyLeaves();
        setLeaves(data);
      } catch (error) {
        console.error('Error fetching leaves:', error);
      }
    };
    
    fetchLeaves();
  }, [isManagerView]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  const handleApproveReject = (leave, action) => {
    setSelectedLeave(leave);
    setComments('');
    setOpenDialog(true);
  };

  const handleSubmitDecision = async () => {
    if (!selectedLeave) return;
    
    try {
      await updateLeaveStatus(selectedLeave.id, comments ? 'rejected' : 'approved', comments);
      setLeaves(leaves.filter(leave => leave.id !== selectedLeave.id));
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {isManagerView && <TableCell>Employee</TableCell>}
              <TableCell>Leave Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Status</TableCell>
              {isManagerView && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave.id}>
                {isManagerView && <TableCell>{leave.employee_name}</TableCell>}
                <TableCell>{leave.leave_type_name}</TableCell>
                <TableCell>{format(new Date(leave.start_date), 'dd MMM yyyy')}</TableCell>
                <TableCell>{format(new Date(leave.end_date), 'dd MMM yyyy')}</TableCell>
                <TableCell>{leave.days_requested}</TableCell>
                <TableCell>
                  <Chip 
                    label={leave.status} 
                    color={getStatusColor(leave.status)} 
                    variant="outlined" 
                  />
                </TableCell>
                {isManagerView && leave.status === 'pending' && (
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="success" 
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleApproveReject(leave, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      size="small"
                      onClick={() => handleApproveReject(leave, 'reject')}
                    >
                      Reject
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Decision Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedLeave?.employee_name ? `Leave Application - ${selectedLeave.employee_name}` : 'Leave Application'}
        </DialogTitle>
        <DialogContent>
          <p><strong>Reason:</strong> {selectedLeave?.reason}</p>
          {!comments && (
            <TextField
              autoFocus
              margin="dense"
              label="Rejection Comments"
              fullWidth
              multiline
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitDecision} 
            color={comments ? "error" : "success"}
          >
            {comments ? 'Confirm Reject' : 'Confirm Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeaveList;