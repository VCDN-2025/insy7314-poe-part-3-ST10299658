import axios from 'axios';

// Determine the correct API URL based on environment
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }

  return 'https://insy7314-poe-part-3-st10407732.onrender.com/api';
};

const API_URL = getApiUrl();

console.log('🔍 API_URL being used:', API_URL);
console.log('🔍 Current hostname:', window.location.hostname);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token if exists
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: temporarily disable auto-logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Temporarily disable 401 redirect for testing
    // if (error.response?.status === 401) {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('user');
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH APIs
// ============================================
export const register = async (userData) => api.post('/auth/register', userData);

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getProtected = async () => api.get('/protected');

// ============================================
// EMPLOYEE MANAGEMENT APIs
// ============================================
export const createEmployee = (data) => api.post('/employees', data);
export const listEmployees = () => api.get('/employees');
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// ============================================
// PAYMENT APIs
// ============================================
export const createPayment = (data) => api.post('/payments', data);
export const getUserPayments = () => api.get('/payments');
export const getPaymentById = (id) => api.get(`/payments/${id}`);
export const getAllPayments = () => api.get('/admin/payments/all');
export const getPendingPayments = () => api.get('/payments/pending/all');
export const verifyPayment = (id) => api.patch(`/payments/${id}/verify`);
export const completePayment = (id) => api.patch(`/payments/${id}/complete`);

// Legacy aliases
export const registerUser = register;
export const loginUser = login;
export const logoutUser = logout;
export const checkAuth = getProtected;

export default api;
