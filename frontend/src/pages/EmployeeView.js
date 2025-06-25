import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import LeaveForm from '../components/LeaveForm';
import LeaveList from '../components/LeaveList';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function EmployeeView() {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSubmitSuccess = () => {
    setRefreshKey(prev => prev + 1);
    handleDialogClose();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="My Leave Applications" />
              <Tab label="Apply for Leave" />
            </Tabs>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleDialogOpen}
              sx={{ mt: 2, mb: 1 }}
            >
              + New Application
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom>
          My Leave History
        </Typography>
        <LeaveList key={refreshKey} />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom>
          Apply for Leave
        </Typography>
        <LeaveForm onSubmitSuccess={handleSubmitSuccess} />
      </TabPanel>
      
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Apply for New Leave</DialogTitle>
        <DialogContent>
          <LeaveForm onSubmitSuccess={handleSubmitSuccess} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}