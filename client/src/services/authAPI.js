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
  }
};