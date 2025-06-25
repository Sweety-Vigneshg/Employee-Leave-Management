import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
  const { currentUser, logout: contextLogout } = useAuth();
  const navigate = useNavigate();
  
  // Create a logout function that combines context logout and navigation
  const logout = () => {
    contextLogout();
    navigate('/login');
  };
  
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