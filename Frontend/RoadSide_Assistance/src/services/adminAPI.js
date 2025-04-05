// Admin Dashboard API Service
const API_URL = 'http://localhost:5000/api'; // Change this to your backend URL

// Helper function for making API requests
const fetchWithAuth = async (endpoint, options = {}) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Set default headers with auth token
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  // Merge options
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Handle 401 unauthorized (token expired or invalid)
    if (response.status === 401) {
      // You could redirect to login or refresh token here
      localStorage.removeItem('token');
      window.location.href = '/login';
      return null;
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Dashboard stats
export const getDashboardStats = async () => {
  return fetchWithAuth('/admin/dashboard/stats', {
    method: 'GET',
  });
};

// Users API
export const getUsers = async (page = 1, limit = 10) => {
  return fetchWithAuth(`/admin/users?page=${page}&limit=${limit}`, {
    method: 'GET',
  });
};

export const createUser = async (userData) => {
  return fetchWithAuth('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (userId, userData) => {
  return fetchWithAuth(`/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (userId) => {
  return fetchWithAuth(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
};

// Services API
export const getServices = async (page = 1, limit = 10) => {
  return fetchWithAuth(`/admin/services?page=${page}&limit=${limit}`, {
    method: 'GET',
  });
};

export const getServiceRequests = async (page = 1, limit = 10, status = '') => {
  let endpoint = `/admin/service-requests?page=${page}&limit=${limit}`;
  if (status) {
    endpoint += `&status=${status}`;
  }
  return fetchWithAuth(endpoint, {
    method: 'GET',
  });
};

export const updateServiceRequest = async (requestId, updateData) => {
  return fetchWithAuth(`/admin/service-requests/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

// Analytics API
export const getServiceUsageData = async (period = 'month') => {
  return fetchWithAuth(`/admin/analytics/service-usage?period=${period}`, {
    method: 'GET',
  });
};

export const getRevenueData = async (period = 'month') => {
  return fetchWithAuth(`/admin/analytics/revenue?period=${period}`, {
    method: 'GET',
  });
};

export const getRecentActivities = async (limit = 5) => {
  return fetchWithAuth(`/admin/activities?limit=${limit}`, {
    method: 'GET',
  });
};

export default {
  getDashboardStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getServices,
  getServiceRequests,
  updateServiceRequest,
  getServiceUsageData,
  getRevenueData,
  getRecentActivities,
}; 