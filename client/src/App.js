import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import EmployeeView from './pages/EmployeeView';
import AdminView from './pages/AdminView';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import { Box, Typography } from '@mui/material';

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
          element={!user ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <Signup /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/" 
          element={user ? (
            user.role === 'admin' ? 
              <Navigate to="/admin" replace /> : 
              <Navigate to="/employee" replace />
          ) : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/employee" 
          element={user ? <EmployeeView /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/admin" 
          element={user && user.role === 'admin' ? <AdminView /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/profile" 
          element={user ? <ProfilePage /> : <Navigate to="/login" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;