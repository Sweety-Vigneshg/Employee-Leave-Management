import axios from 'axios';
import { getAuthHeader } from './authAPI';

const API_URL = 'http://localhost:5000/api/leaves';

export const applyLeave = async (leaveData) => {
  const response = await axios.post(`${API_URL}/apply`, leaveData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getMyLeaves = async () => {
  const response = await axios.get(`${API_URL}/my-leaves`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getPendingLeaves = async () => {
  const response = await axios.get(`${API_URL}/pending`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updateLeaveStatus = async (id, status, comments) => {
  const response = await axios.put(`${API_URL}/${id}/status`, 
    { status, manager_comments: comments },
    { headers: getAuthHeader() }
  );
  return response.data;
};