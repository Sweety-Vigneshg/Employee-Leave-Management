import axios from './api';

export const leaveAPI = {
  applyLeave: async (startDate, endDate, reason) => {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/leaves', {
      start_date: startDate,
      end_date: endDate,
      reason
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  getLeaves: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/leaves', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  updateLeaveStatus: async (leaveId, status) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`/api/leaves/${leaveId}`, {
      status
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};