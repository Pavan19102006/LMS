import axios from 'axios';

// Simple configuration - use /api for all requests
// In development, the proxy in package.json will forward to localhost:5001
// In production, /api will be served from the same domain
const baseURL = '/api';

console.log('✅ Axios configured with baseURL:', baseURL);

// Set the base URL
axios.defaults.baseURL = baseURL;

console.log('🚀 Axios instance ready');

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: any) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axios.interceptors.response.use(
  (response: any) => {
    console.log('📥 Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error: any) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
