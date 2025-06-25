import axios from './api';

export const authAPI = {
  login: async (username, password) => {
    const response = await axios.post('/api/login', { username, password });
    return response.data;
  },
  register: async (username, password, role) => {
    const response = await axios.post('/api/register', { username, password, role });
    return response.data;
  },
  getUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const response = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  },
  
  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put('/api/profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put('/api/change-password', passwordData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};