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
  MenuItem 
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
      .min(10, 'Reason must be at least 10 characters')
  });

  const formik = useFormik({
    initialValues: {
      startDate: dayjs().add(1, 'day'),
      endDate: dayjs().add(2, 'day'),
      reason: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setError('');
      
      try {
        await leaveAPI.applyLeave(
          values.startDate.format('YYYY-MM-DD'),
          values.endDate.format('YYYY-MM-DD'),
          values.reason
        );
        onSuccess();
        formik.resetForm();
      } catch (err) {
        setError('Failed to submit leave application. Please try again.');
        console.error('Leave application error:', err);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fafafa' }}>
      <Typography variant="h6" gutterBottom>
        Apply for Leave
      </Typography>
      
      {error && (
        <Box sx={{ 
          backgroundColor: '#ffebee', 
          color: '#f44336', 
          p: 2, 
          mb: 2,
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
              <TextField
                fullWidth
                label="Reason for Leave"
                multiline
                rows={4}
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="reason"
                error={formik.touched.reason && Boolean(formik.errors.reason)}
                helperText={formik.touched.reason && formik.errors.reason}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
                fullWidth
                size="large"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </form>
    </Box>
  );
};

export default LeaveForm;