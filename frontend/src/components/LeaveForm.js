import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  CircularProgress
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAuth } from '../context/AuthContext';
import { leaveAPI } from '../api';

const validationSchema = Yup.object({
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  reason: Yup.string()
    .required('Reason is required')
    .min(10, 'Reason must be at least 10 characters'),
  leaveType: Yup.string().required('Leave type is required'),
});

export default function LeaveForm({ onSubmitSuccess }) {
  const { currentUser } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      startDate: new Date(),
      endDate: new Date(),
      reason: '',
      leaveType: 'vacation',
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const token = localStorage.getItem('token');
        await leaveAPI.create({
          startDate: values.startDate.toISOString().split('T')[0],
          endDate: values.endDate.toISOString().split('T')[0],
          reason: values.reason,
          leaveType: values.leaveType,
        }, token);
        
        onSubmitSuccess();
        formik.resetForm();
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DesktopDatePicker
              label="Start Date"
              inputFormat="MM/dd/yyyy"
              value={formik.values.startDate}
              onChange={(date) => formik.setFieldValue('startDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={formik.touched.startDate && !!formik.errors.startDate}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DesktopDatePicker
              label="End Date"
              inputFormat="MM/dd/yyyy"
              value={formik.values.endDate}
              onChange={(date) => formik.setFieldValue('endDate', date)}
              minDate={formik.values.startDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={formik.touched.endDate && !!formik.errors.endDate}
                  helperText={formik.touched.endDate && formik.errors.endDate}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Leave Type</InputLabel>
              <Select
                name="leaveType"
                value={formik.values.leaveType}
                onChange={formik.handleChange}
                label="Leave Type"
              >
                <MenuItem value="vacation">Vacation</MenuItem>
                <MenuItem value="sick">Sick Leave</MenuItem>
                <MenuItem value="personal">Personal Leave</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reason"
              name="reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              error={formik.touched.reason && !!formik.errors.reason}
              helperText={formik.touched.reason && formik.errors.reason}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Submit Application'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}