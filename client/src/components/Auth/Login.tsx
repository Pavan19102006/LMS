import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axios';
import './TechLogin.css';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
    // Clear form fields when switching tabs
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setRole('student');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔥 Frontend Login Debug:');
      console.log('- Email:', email);
      console.log('- API Base URL:', axios.defaults.baseURL);
      console.log('- Current URL:', window.location.href);
      
      await login(email, password);
      console.log('✅ Login completed successfully');
      
      // Set success message and navigate after a short delay
      setSuccess('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } catch (err: any) {
      console.error('🚨 Login Error Details:', {
        message: err.message,
        response: err.response,
        responseData: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(`Login failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔥 Frontend Registration Debug:');
      console.log('- Email:', email);
      console.log('- API Base URL:', axios.defaults.baseURL);
      console.log('- Current URL:', window.location.href);
      console.log('- Registration data:', { email, firstName, lastName, role });
      
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        firstName,
        lastName,
        role,
      });
      
      console.log('✅ Registration Success:', response.data);

      setSuccess('Account created successfully! Please log in.');
      setActiveTab(0); // Switch to login tab
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setRole('student');
    } catch (err: any) {
      console.error('🚨 Registration Error Details:', {
        message: err.message,
        response: err.response,
        responseData: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        config: err.config
      });
      
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(`Registration failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccountSelect = (e: SelectChangeEvent) => {
    const selectedAccount = e.target.value as string;
    if (selectedAccount) {
      const [email, password] = selectedAccount.split('|');
      setEmail(email);
      setPassword(password);
      setActiveTab(0); // Switch to login tab
    }
  };

  return (
    <div className="tech-login-container">
      {/* Tech Logo */}
      <div id="tech-logo"> 
        <h1><i>LMS Portal</i></h1>
      </div>

      {/* Main Login Section */}
      <section className="tech-login"> 
        <form onSubmit={activeTab === 0 ? handleLogin : handleSignup}>	
          <div id="fade-box">
            {/* Tab Navigation */}
            <div className="tech-tabs">
              <button 
                type="button"
                className={activeTab === 0 ? 'tech-tab active' : 'tech-tab'}
                onClick={() => handleTabChange({} as React.SyntheticEvent, 0)}
              >
                Login
              </button>
              <button 
                type="button"
                className={activeTab === 1 ? 'tech-tab active' : 'tech-tab'}
                onClick={() => handleTabChange({} as React.SyntheticEvent, 1)}
              >
                Sign Up
              </button>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="tech-alert tech-error">
                {error}
              </div>
            )}
            {success && (
              <div className="tech-alert tech-success">
                {success}
              </div>
            )}

            {/* Login Form */}
            {activeTab === 0 && (
              <>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Logging In...' : 'Log In'}
                </button>
              </>
            )}

            {/* Sign Up Form */}
            {activeTab === 1 && (
              <>
                <input 
                  type="text" 
                  name="firstName" 
                  id="firstName" 
                  placeholder="First Name" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
                <input 
                  type="text" 
                  name="lastName" 
                  id="lastName" 
                  placeholder="Last Name" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
                <input 
                  type="email" 
                  name="email" 
                  id="signupEmail" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <input 
                  type="password" 
                  name="password" 
                  id="signupPassword" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <select 
                  name="role" 
                  id="role" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="tech-select"
                  required
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="content-creator">Content Creator</option>
                </select>
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </>
            )}

            {/* Demo Accounts Section - Only show on login */}
            {activeTab === 0 && (
              <div className="demo-accounts">
                <Typography variant="h6" sx={{ color: '#00fffc', fontSize: '1.2rem', mb: 2 }}>
                  Demo Accounts
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value=""
                    onChange={handleDemoAccountSelect}
                    displayEmpty
                    sx={{
                      backgroundColor: '#222',
                      border: '1px solid #444',
                      borderRadius: '5px',
                      color: '#888',
                      '& .MuiSelect-select': {
                        padding: '10px',
                        fontFamily: 'Cabin, helvetica, arial, sans-serif',
                        fontSize: '13px',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #00fffc',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #00fffc',
                      },
                    }}
                  >
                    <MenuItem value="">Select Demo Account</MenuItem>
                    <MenuItem value="admin@lms.com|admin123">👑 Admin</MenuItem>
                    <MenuItem value="instructor@lms.com|instructor123">👨‍🏫 Instructor</MenuItem>
                    <MenuItem value="student@lms.com|student123">🎓 Student</MenuItem>
                    <MenuItem value="creator@lms.com|creator123">✍️ Creator</MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
          </div>
        </form>

        {/* Hexagon Mesh Background */}
        <div className="hexagons">
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <br />
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <br />
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span> 
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <br />
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <br />
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
        </div>      
      
        {/* Rotating Circle */}
        <div id="tech-circle1">
          <div id="tech-inner-circle1">
            <h2> </h2>
          </div>
        </div>
      </section> 
    </div>
  );
};

export default Login;
