import axios from "axios";

const BASE_URL = "http://localhost:6009"; // Updated to match your API endpoint

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Token management functions
const TokenManager = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
};

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    console.log("Request data:", config.data);
    
    const token = TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.data);
    return response;
  },
  (error) => {
    console.error("Response error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Token expired or invalid
      TokenManager.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
