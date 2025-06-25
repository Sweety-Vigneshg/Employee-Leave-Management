import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel,
  CircularProgress
} from '@mui/material';
import { applyLeave } from '../services/leaveAPI';
import { useNavigate } from 'react-router-dom';

const LeaveSchema = Yup.object().shape({
  leave_type_id: Yup.string().required('Required'),
  start_date: Yup.date().required('Required'),
  end_date: Yup.date()
    .required('Required')
    .min(Yup.ref('start_date'), 'End date must be after start date'),
  reason: Yup.string().required('Required')
});

const LeaveForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const days_requested = calculateDays(values.start_date, values.end_date);
      await applyLeave({ ...values, days_requested });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error applying leave:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: ''
      }}
      validationSchema={LeaveSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Field
                  as={Select}
                  name="leave_type_id"
                  label="Leave Type"
                  error={touched.leave_type_id && !!errors.leave_type_id}
                >
                  <MenuItem value="1">Casual Leave</MenuItem>
                  <MenuItem value="2">Sick Leave</MenuItem>
                  <MenuItem value="3">Annual Leave</MenuItem>
                </Field>
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <Field
                as={TextField}
                name="start_date"
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                error={touched.start_date && !!errors.start_date}
                helperText={touched.start_date && errors.start_date}
                onChange={(e) => {
                  setFieldValue('start_date', e.target.value);
                  if (values.end_date) {
                    const days = calculateDays(e.target.value, values.end_date);
                    setFieldValue('days_requested', days);
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <Field
                as={TextField}
                name="end_date"
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                error={touched.end_date && !!errors.end_date}
                helperText={touched.end_date && errors.end_date}
                onChange={(e) => {
                  setFieldValue('end_date', e.target.value);
                  if (values.start_date) {
                    const days = calculateDays(values.start_date, e.target.value);
                    setFieldValue('days_requested', days);
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Field
                as={TextField}
                name="days_requested"
                label="Days Requested"
                type="number"
                fullWidth
                disabled
              />
            </Grid>
            
            <Grid item xs={12}>
              <Field
                as={TextField}
                name="reason"
                label="Reason"
                multiline
                rows={4}
                fullWidth
                error={touched.reason && !!errors.reason}
                helperText={touched.reason && errors.reason}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Application'}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default LeaveForm;