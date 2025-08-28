import axios from 'axios';

// Simple and bulletproof approach
const currentUrl = window.location.href;
const hostname = window.location.hostname;

console.log('🔍 Simple Axios Config Debug:');
console.log('- Current URL:', currentUrl);
console.log('- Hostname:', hostname);

// Only use localhost:5001 if we're explicitly on localhost
// Everything else uses /api
const isExplicitLocalhost = (
  hostname === 'localhost' || 
  hostname === '127.0.0.1'
) && window.location.protocol === 'http:';

const baseURL = isExplicitLocalhost ? 'http://localhost:5001' : '/api';

console.log('- Is Explicit Localhost:', isExplicitLocalhost);
console.log('✅ FINAL API Base URL:', baseURL);

// Set the axios default
axios.defaults.baseURL = baseURL;

// Double-check and force correction if needed
if (currentUrl.includes('vercel.app') && baseURL !== '/api') {
  console.log('� Vercel detected - forcing /api');
  axios.defaults.baseURL = '/api';
}

if (currentUrl.includes('netlify.app') && baseURL !== '/api') {
  console.log('� Netlify detected - forcing /api');  
  axios.defaults.baseURL = '/api';
}

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
