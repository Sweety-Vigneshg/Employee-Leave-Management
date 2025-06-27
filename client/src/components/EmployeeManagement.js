import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Tooltip,
  Stack,
  Card,
  CardContent,
  Divider,
  useTheme,
  alpha,
  TablePagination,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  AdminPanelSettings as AdminIcon,
  PersonAdd as PersonAddIcon,
  Visibility as ViewIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EmployeeManagement = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    role: 'employee',
    password: ''
  });

  const theme = useTheme();

  // Axios instance with base configuration
  const api = axios.create({
    baseURL: '/api/employees',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  // Fetch employees from backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/');
      setEmployees(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch employees: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (mode, employee = null) => {
    setDialogMode(mode);
    setSelectedEmployee(employee);
    
    if (employee) {
      setFormData({
        full_name: employee.full_name || '',
        username: employee.username || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || '',
        department: employee.department || '',
        role: employee.role || 'employee',
        password: ''  // Password not shown for existing users
      });
    } else {
      setFormData({
        full_name: '',
        username: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        role: 'employee',
        password: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'add') {
        const response = await api.post('/', formData);
        setEmployees(prev => [...prev, response.data]);
        setSuccess('Employee added successfully');
      } else if (dialogMode === 'edit' && selectedEmployee) {
        // Don't send password in edit mode unless it's being changed
        const { password, ...updateData } = formData;
        const payload = password ? formData : updateData;
        
        const response = await api.put(`/${selectedEmployee.id}`, payload);
        setEmployees(prev => prev.map(emp => 
          emp.id === response.data.id ? response.data : emp
        ));
        setSuccess('Employee updated successfully');
      }
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save employee: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      await api.delete(`/${selectedEmployee.id}`);
      setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));
      setSuccess('Employee deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      setError('Failed to delete employee: ' + (err.response?.data?.message || err.message));
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'primary';
      case 'employee':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 400 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Employee Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total: {employees.length} employees
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => handleOpenDialog('add')}
          sx={{
            backgroundColor: '#7c3aed',
            '&:hover': { backgroundColor: '#5b21b6' },
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2
          }}
        >
          Add Employee
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 3,
          border: '1px solid #e0e7ff',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search employees..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Total: ${employees.length}`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Admins: ${employees.filter(e => e.role === 'admin').length}`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Employees: ${employees.filter(e => e.role === 'employee').length}`} 
                  color="default" 
                  variant="outlined" 
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card 
        elevation={0}
        sx={{ 
          border: '1px solid #e0e7ff',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                <TableRow 
                  key={employee.id}
                  sx={{ 
                    '&:hover': { backgroundColor: '#f8fafc' },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          mr: 2,
                          backgroundColor: '#7c3aed',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {employee.full_name?.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {employee.full_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          ID: {employee.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, color: '#64748b', mr: 1 }} />
                        <Typography variant="body2">
                          {employee.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 16, color: '#64748b', mr: 1 }} />
                        <Typography variant="body2">
                          {employee.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.position}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.department}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={employee.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                      label={employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                      color={getRoleColor(employee.role)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small"
                          onClick={() => handleOpenDialog('view', employee)}
                          sx={{ color: '#10b981' }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Employee">
                        <IconButton 
                          size="small"
                          onClick={() => handleOpenDialog('edit', employee)}
                          sx={{ color: '#f59e0b' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Employee">
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{ color: '#ef4444' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredEmployees.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ borderTop: '1px solid #e0e7ff' }}
        />
      </Card>

      {/* Add/Edit Employee Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid #e0e7ff'
        }}>
          <Avatar sx={{ 
            backgroundColor: alpha('#7c3aed', 0.1),
            color: '#7c3aed'
          }}>
            {dialogMode === 'add' ? <PersonAddIcon /> : 
             dialogMode === 'edit' ? <EditIcon /> : <ViewIcon />}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {dialogMode === 'add' ? 'Add New Employee' : 
               dialogMode === 'edit' ? 'Edit Employee' : 'Employee Details'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {dialogMode === 'view' ? 'View employee information' : 'Fill in the employee details'}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={dialogMode === 'view'}
                  label="Role"
                >
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {dialogMode === 'add' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
            {dialogMode === 'edit' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password (optional)"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Leave blank to keep current password"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid #e0e7ff' }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ textTransform: 'none' }}
          >
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogMode !== 'view' && (
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{
                backgroundColor: '#7c3aed',
                '&:hover': { backgroundColor: '#5b21b6' },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {dialogMode === 'add' ? 'Add Employee' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          color: '#ef4444'
        }}>
          <DeleteIcon />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete employee "{selectedEmployee?.full_name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteEmployee}
            color="error"
            variant="contained"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert 
          onClose={() => setSuccess('')} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeManagement;