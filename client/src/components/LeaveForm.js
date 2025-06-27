import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  Chip,
  Paper,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { CalendarToday, AccessTime, Category, Description } from '@mui/icons-material';
import { leaveAPI } from '../services/leaveAPI';

const LeaveForm = ({ onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    startDate: Yup.object()
      .required('Start date is required')
      .test(
        'is-future',
        'Start date must be in the future',
        value => value && value.isAfter(dayjs().subtract(1, 'day'))
      ),
    endDate: Yup.object()
      .required('End date is required')
      .test(
        'after-start',
        'End date must be after start date',
        function(value) {
          const startDate = this.parent.startDate;
          return value && startDate && value.isAfter(startDate);
        }
      ),
    reason: Yup.string()
      .required('Reason is required')
      .min(10, 'Reason must be at least 10 characters'),
    leaveType: Yup.string()
      .required('Leave type is required')
  });

  const formik = useFormik({
    initialValues: {
      startDate: dayjs().add(1, 'day'),
      endDate: dayjs().add(2, 'day'),
      reason: '',
      leaveType: 'vacation'
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setError('');
      
      try {
        await leaveAPI.applyLeave(
          values.startDate.format('YYYY-MM-DD'),
          values.endDate.format('YYYY-MM-DD'),
          values.reason,
          values.leaveType
        );
        onSuccess();
        formik.resetForm({
          values: {
            startDate: dayjs().add(1, 'day'),
            endDate: dayjs().add(2, 'day'),
            reason: '',
            leaveType: 'vacation'
          }
        });
      } catch (err) {
        setError('Failed to submit leave application. Please try again.');
        console.error('Leave application error:', err);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const calculateDuration = () => {
    if (formik.values.startDate && formik.values.endDate) {
      return formik.values.endDate.diff(formik.values.startDate, 'day') + 1;
    }
    return 0;
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

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={formik.handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={4}>
            {/* Date Selection Section */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 1, color: '#1976d2', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                  Leave Dates
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Start Date"
                    value={formik.values.startDate}
                    onChange={(date) => formik.setFieldValue('startDate', date)}
                    minDate={dayjs().add(1, 'day')}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                        helperText={formik.touched.startDate && formik.errors.startDate}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="End Date"
                    value={formik.values.endDate}
                    onChange={(date) => formik.setFieldValue('endDate', date)}
                    minDate={formik.values.startDate ? formik.values.startDate.add(1, 'day') : dayjs().add(2, 'day')}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                        helperText={formik.touched.endDate && formik.errors.endDate}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Leave Type and Duration Section */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: 2
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Category sx={{ mr: 1, color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      Leave Type
                    </Typography>
                  </Box>
                  
                  <FormControl fullWidth>
                    <InputLabel>Select Leave Type</InputLabel>
                    <Select
                      value={formik.values.leaveType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="leaveType"
                      error={formik.touched.leaveType && Boolean(formik.errors.leaveType)}
                      sx={{
                        backgroundColor: 'white'
                      }}
                    >
                      <MenuItem value="vacation">Vacation</MenuItem>
                      <MenuItem value="sick">Sick Leave</MenuItem>
                      <MenuItem value="personal">Personal Leave</MenuItem>
                      <MenuItem value="bereavement">Bereavement</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime sx={{ mr: 1, color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      Duration
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    textAlign: 'center',
                    backgroundColor: 'white',
                    borderRadius: 2,
                    p: 2,
                    border: '2px solid #e3f2fd'
                  }}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold', 
                      color: '#1976d2',
                      mb: 0.5
                    }}>
                      {calculateDuration()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {calculateDuration() === 1 ? 'day' : 'days'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Reason Section */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Description sx={{ mr: 1, color: '#1976d2', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                  Reason for Leave
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Please provide details about your leave request"
                placeholder="Enter a detailed reason for your leave application..."
                multiline
                rows={4}
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="reason"
                error={formik.touched.reason && Boolean(formik.errors.reason)}
                helperText={formik.touched.reason && formik.errors.reason}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white'
                  }
                }}
              />
            </Paper>

            {/* Summary Section */}
            {formik.values.startDate && formik.values.endDate && formik.values.leaveType && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  backgroundColor: '#e8f5e8',
                  border: '1px solid #c8e6c9',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2e7d32' }}>
                  Application Summary
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Leave Period
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formik.values.startDate.format('MMM DD, YYYY')} - {formik.values.endDate.format('MMM DD, YYYY')}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Type
                    </Typography>
                    <Chip 
                      label={getLeaveTypeLabel(formik.values.leaveType)}
                      size="small"
                      sx={{ 
                        backgroundColor: getLeaveTypeColor(formik.values.leaveType),
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Duration
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {calculateDuration()} {calculateDuration() === 1 ? 'day' : 'days'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Submit Button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              pt: 2
            }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                size="large"
                sx={{ 
                  minWidth: 200,
                  fontWeight: 600,
                  fontSize: 16,
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc'
                  }
                }}
              >
                {submitting ? 'Submitting Application...' : 'Submit Leave Application'}
              </Button>
            </Box>
          </Stack>
        </LocalizationProvider>
      </form>
    </Box>
  );
};

export default LeaveForm;