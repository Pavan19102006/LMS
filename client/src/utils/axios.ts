import axios from 'axios';


const getApiBaseUrl = () => {
  
  if (process.env.REACT_APP_API_URL) {
    console.log('🌐 Using configured API URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL + '/api';
  }

  
  const currentUrl = window.location.href;
  const hostname = window.location.hostname;

  console.log('🔍 Auto-detecting API URL:');
  console.log('- Current URL:', currentUrl);
  console.log('- Hostname:', hostname);

  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http:
  }

  
  if (hostname.includes('replit.dev') || hostname.includes('replit.co')) {
    return '/api';  
  }

  
  return '/api';
};

const baseURL = getApiBaseUrl();
console.log('✅ Final API Base URL:', baseURL);


axios.defaults.baseURL = baseURL;

console.log('🚀 Axios configured with baseURL:', axios.defaults.baseURL);


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
