const API_BASE = '/api';

export const authAPI = {
  login: (email, password) => 
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),
};

export const leaveAPI = {
  create: (leaveData, token) => 
    fetch(`${API_BASE}/leaves`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(leaveData),
    }).then(handleResponse),
  
  getEmployeeLeaves: (token) => 
    fetch(`${API_BASE}/leaves/employee`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    }).then(handleResponse),
  
  getAllLeaves: (token) => 
    fetch(`${API_BASE}/leaves/all`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    }).then(handleResponse),
  
  updateStatus: (id, status, token) => 
    fetch(`${API_BASE}/leaves/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }).then(handleResponse),
};

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}