import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '../utils/axios';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'instructor' | 'student' | 'content_creator';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('AuthContext useEffect: token from localStorage:', token);
    if (token) {
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('AuthContext useEffect: Set auth header, calling fetchUserProfile');
      fetchUserProfile();
    } else {
      console.log('AuthContext useEffect: No token found, setting loading to false');
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    console.log('Fetching user profile...');
    try {
      const response = await axios.get('/api/auth/profile');
      console.log('Fetch user profile response:', response.data);
      setUser(response.data);
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔥 AuthContext Login Debug:');
      console.log('- Email:', email);
      console.log('- API Base URL:', axios.defaults.baseURL);
      console.log('- Current URL:', window.location.href);
      console.log('- Making request to:', axios.defaults.baseURL + '/api/auth/login');
      
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage:', localStorage.getItem('token'));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      console.log('✅ Login successful, user set:', user);
    } catch (error: any) {
      console.error('🚨 AuthContext Login Error:', {
        message: error.message,
        response: error.response,
        responseData: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: error.config
      });
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out, clearing token and user.');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
