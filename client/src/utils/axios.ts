import axios from 'axios';

// Get API URL from environment or detect automatically
const getApiBaseUrl = () => {
  // Check if we have a production API URL set
  if (process.env.REACT_APP_API_URL) {
    console.log('🌐 Using configured API URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }

  // Fallback to auto-detection
  const currentUrl = window.location.href;
  const hostname = window.location.hostname;

  console.log('🔍 Auto-detecting API URL:');
  console.log('- Current URL:', currentUrl);
  console.log('- Hostname:', hostname);

  // For development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5001/api';
  }

  // For Replit
  if (hostname.includes('replit.dev') || hostname.includes('replit.co')) {
    return '/api';  // Use proxy
  }

  // For production deployments (same domain)
  return '/api';
};

const baseURL = getApiBaseUrl();
console.log('✅ Final API Base URL:', baseURL);

// Set the axios default
axios.defaults.baseURL = baseURL;

console.log('🚀 Axios configured with baseURL:', axios.defaults.baseURL);

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
