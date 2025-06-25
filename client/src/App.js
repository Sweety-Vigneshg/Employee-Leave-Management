import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import EmployeeView from './pages/EmployeeView';
import AdminView from './pages/AdminView';
import Navbar from './components/Navbar';
import { Box, Typography } from '@mui/material'; // ADDED MISSING IMPORTS

function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

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
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={user ? (
            user.role === 'admin' ? 
              <Navigate to="/admin" /> : 
              <Navigate to="/employee" />
          ) : <Navigate to="/login" />} 
        />
        <Route 
          path="/employee" 
          element={user ? <EmployeeView /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={user && user.role === 'admin' ? <AdminView /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;