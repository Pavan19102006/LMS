import axios from 'axios';

// Simple and bulletproof approach
const currentUrl = window.location.href;
const hostname = window.location.hostname;

console.log('🔍 Simple Axios Config Debug:');
console.log('- Current URL:', currentUrl);
console.log('- Hostname:', hostname);

// For Replit development, use the proxy configuration
let baseURL = '';

// Check if we're in Replit environment
if (hostname.includes('replit.dev') || hostname.includes('replit.co')) {
  baseURL = '';  // Use proxy via package.json proxy setting
} else if (hostname === 'localhost' || hostname === '127.0.0.1') {
  baseURL = 'http://localhost:5001';
} else {
  baseURL = '/api';  // For production deployments
}

console.log('- Environment detected, baseURL:', baseURL);
console.log('✅ FINAL API Base URL:', baseURL);

// Set the axios default
axios.defaults.baseURL = baseURL;

console.log('🚀 CONFIRMED Final API Base URL:', axios.defaults.baseURL);

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axios.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
