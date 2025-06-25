import axios from './api';

export const leaveAPI = {
  applyLeave: async (startDate, endDate, reason, leaveType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/leaves', {
        start_date: startDate,
        end_date: endDate,
        reason,
        leave_type: leaveType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Leave submission error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  getLeaves: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Leave retrieval error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  updateLeaveStatus: async (leaveId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/leaves/${leaveId}`, {
        status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Status update error:', error.response?.data || error.message);
      throw error;
    }
  }
};