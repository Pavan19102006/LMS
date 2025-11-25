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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return null;
  };

  const validateName = (name: string, fieldName: string): string | null => {
    if (!name || name.trim() === '') return `${fieldName} is required`;
    if (name.trim().length < 2) return `${fieldName} must be at least 2 characters long`;
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) return `${fieldName} can only contain letters`;
    return null;
  };

  // Handler to filter out non-letter characters
  const handleNameInput = (value: string, setter: (val: string) => void, fieldName: 'firstName' | 'lastName') => {
    // Only allow letters and spaces
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
    setter(filteredValue);
    
    // Clear validation error for this field if exists
    if (validationErrors[fieldName]) {
      setValidationErrors({...validationErrors, [fieldName]: ''});
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
    
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setRole('student');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear previous errors
    setError('');
    setValidationErrors({});

    // Validate inputs
    const errors: {[key: string]: string} = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError(Object.values(errors)[0]);
      return;
    }

    setLoading(true);

    try {
      console.log('🔥 Frontend Login Debug:');
      console.log('- Email:', email);
      console.log('- API Base URL:', axios.defaults.baseURL);
      console.log('- Current URL:', window.location.href);
      
      await login(email, password);
      console.log('✅ Login completed successfully');
      
      
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
    e.stopPropagation();
    
    // Clear previous errors
    setError('');
    setSuccess('');
    setValidationErrors({});

    // Validate inputs
    const errors: {[key: string]: string} = {};
    const firstNameError = validateName(firstName, 'First name');
    const lastNameError = validateName(lastName, 'Last name');
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (firstNameError) errors.firstName = firstNameError;
    if (lastNameError) errors.lastName = lastNameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError(Object.values(errors)[0]);
      return;
    }

    setLoading(true);

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
      setActiveTab(0); 
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

  const getFieldError = (fieldName: string) => validationErrors[fieldName];

  const handleDemoAccountSelect = (e: SelectChangeEvent) => {
    const selectedAccount = e.target.value as string;
    if (selectedAccount) {
      const [email, password] = selectedAccount.split('|');
      setEmail(email);
      setPassword(password);
      setActiveTab(0); 
    }
  };

  return (
    <div className="tech-login-container">
      {}
      <div id="tech-logo"> 
        <h1><i>LMS Portal</i></h1>
      </div>

      {}
      <section className="tech-login"> 
        <form onSubmit={activeTab === 0 ? handleLogin : handleSignup}>	
          <div id="fade-box">
            {}
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

            {}
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

            {}
            {activeTab === 0 && (
              <>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) {
                      setValidationErrors({...validationErrors, email: ''});
                    }
                  }}
                  onBlur={() => {
                    const error = validateEmail(email);
                    if (error) {
                      setValidationErrors({...validationErrors, email: error});
                    }
                  }}
                  className={validationErrors.email ? 'error' : ''}
                  required 
                />
                {validationErrors.email && (
                  <div className="field-error">{validationErrors.email}</div>
                )}
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="Password (min 6 characters)" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({...validationErrors, password: ''});
                    }
                  }}
                  onBlur={() => {
                    const error = validatePassword(password);
                    if (error) {
                      setValidationErrors({...validationErrors, password: error});
                    }
                  }}
                  className={validationErrors.password ? 'error' : ''}
                  required 
                />
                {validationErrors.password && (
                  <div className="field-error">{validationErrors.password}</div>
                )}
                <button type="submit" disabled={loading}>
                  {loading ? 'Logging In...' : 'Log In'}
                </button>
              </>
            )}

            {}
            {activeTab === 1 && (
              <>
                <input 
                  type="text" 
                  name="firstName" 
                  id="firstName" 
                  placeholder="First Name (letters only)" 
                  value={firstName}
                  onChange={(e) => handleNameInput(e.target.value, setFirstName, 'firstName')}
                  onBlur={() => {
                    const error = validateName(firstName, 'First name');
                    if (error) {
                      setValidationErrors({...validationErrors, firstName: error});
                    }
                  }}
                  className={validationErrors.firstName ? 'error' : ''}
                  required 
                />
                {validationErrors.firstName && (
                  <div className="field-error">{validationErrors.firstName}</div>
                )}
                <input 
                  type="text" 
                  name="lastName" 
                  id="lastName" 
                  placeholder="Last Name (letters only)" 
                  value={lastName}
                  onChange={(e) => handleNameInput(e.target.value, setLastName, 'lastName')}
                  onBlur={() => {
                    const error = validateName(lastName, 'Last name');
                    if (error) {
                      setValidationErrors({...validationErrors, lastName: error});
                    }
                  }}
                  className={validationErrors.lastName ? 'error' : ''}
                  required 
                />
                {validationErrors.lastName && (
                  <div className="field-error">{validationErrors.lastName}</div>
                )}
                <input 
                  type="email" 
                  name="email" 
                  id="signupEmail" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) {
                      setValidationErrors({...validationErrors, email: ''});
                    }
                  }}
                  onBlur={() => {
                    const error = validateEmail(email);
                    if (error) {
                      setValidationErrors({...validationErrors, email: error});
                    }
                  }}
                  className={validationErrors.email ? 'error' : ''}
                  required 
                />
                {validationErrors.email && (
                  <div className="field-error">{validationErrors.email}</div>
                )}
                <input 
                  type="password" 
                  name="password" 
                  id="signupPassword" 
                  placeholder="Password (min 6 characters)" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({...validationErrors, password: ''});
                    }
                  }}
                  onBlur={() => {
                    const error = validatePassword(password);
                    if (error) {
                      setValidationErrors({...validationErrors, password: error});
                    }
                  }}
                  className={validationErrors.password ? 'error' : ''}
                  required 
                />
                {validationErrors.password && (
                  <div className="field-error">{validationErrors.password}</div>
                )}
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

            {}
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

        {}
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
      
        {}
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
