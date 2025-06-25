import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import EmployeeView from './pages/EmployeeView';
import AdminView from './pages/AdminView';
import Navbar from './components/Navbar';
import { Box, Typography } from '@mui/material';

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading application...</Typography>
      </Box>
    );
  }

  return (
    <div className="App">
      {user && <Navbar />}
      <Routes>
        {/* Public routes accessible without authentication */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            user ? (
              user.role === 'admin' ? 
                <Navigate to="/admin" replace /> : 
                <Navigate to="/employee" replace />
            ) : (
              <Navigate to="/login" state={{ from: location }} replace />
            )
          } 
        />
        <Route 
          path="/employee" 
          element={
            user ? 
              <EmployeeView /> : 
              <Navigate to="/login" state={{ from: location }} replace />
          } 
        />
        <Route 
          path="/admin" 
          element={
            user && user.role === 'admin' ? 
              <AdminView /> : 
              <Navigate to="/" replace />
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;