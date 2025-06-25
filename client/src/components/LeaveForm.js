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
  CardHeader,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, border: 'none' }}>
      <CardContent>
        {error && (
          <Box sx={{ 
            backgroundColor: '#ffebee', 
            color: '#f44336', 
            p: 2, 
            mb: 3,
            borderRadius: 1
          }}>
            {error}
          </Box>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={formik.values.endDate}
                  onChange={(date) => formik.setFieldValue('endDate', date)}
                  minDate={formik.values.startDate.add(1, 'day')}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                      helperText={formik.touched.endDate && formik.errors.endDate}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  backgroundColor: '#f9f9f9', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid #eee'
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Leave Type
                      </Typography>
                      <FormControl fullWidth>
                        <InputLabel>Select Leave Type</InputLabel>
                        <Select
                          value={formik.values.leaveType}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          name="leaveType"
                          error={formik.touched.leaveType && Boolean(formik.errors.leaveType)}
                        >
                          <MenuItem value="vacation">Vacation</MenuItem>
                          <MenuItem value="sick">Sick Leave</MenuItem>
                          <MenuItem value="personal">Personal Leave</MenuItem>
                          <MenuItem value="bereavement">Bereavement</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Duration
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {calculateDuration()} days
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Leave"
                  placeholder="Please provide details about your leave request"
                  multiline
                  rows={4}
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="reason"
                  error={formik.touched.reason && Boolean(formik.errors.reason)}
                  helperText={formik.touched.reason && formik.errors.reason}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  mt: 2
                }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                    size="large"
                    sx={{ 
                      minWidth: 180,
                      fontWeight: 600,
                      fontSize: 16,
                      py: 1.5
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeaveForm;