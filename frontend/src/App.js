import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import EmployeeView from './pages/EmployeeView';
import AdminView from './pages/AdminView';

function PrivateRoute({ children, adminOnly = false }) {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
}

function AppRoutes() {
  const { currentUser } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            {currentUser?.role === 'admin' ? 
              <Navigate to="/admin" /> : 
              <Navigate to="/employee" />
            }
          </PrivateRoute>
        } 
      />
      <Route 
        path="/employee" 
        element={
          <PrivateRoute>
            <EmployeeView />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <PrivateRoute adminOnly={true}>
            <AdminView />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;