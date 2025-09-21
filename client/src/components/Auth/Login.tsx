import React, { useState, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  LinearProgress,
  Chip
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axios';
import { 
  validateName, 
  validateEmail, 
  validatePassword, 
  validatePasswordConfirmation,
  getPasswordStrength,
  ValidationResult 
} from '../../utils/validation';
import './TechLogin.css';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Validation states
  const [fieldErrors, setFieldErrors] = useState<{
    firstName: string[];
    lastName: string[];
    email: string[];
    password: string[];
    confirmPassword: string[];
  }>({
    firstName: [],
    lastName: [],
    email: [],
    password: [],
    confirmPassword: []
  });
  
  const [fieldTouched, setFieldTouched] = useState<{
    firstName: boolean;
    lastName: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  }>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{strength: string, score: number}>({ strength: 'weak', score: 0 });
  const [isDemoAccount, setIsDemoAccount] = useState(false); // Track if demo account is being used
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Debounced validation function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  };

  // Real-time field validation with useCallback
  const validateFieldRealTime = useCallback(
    debounce(async (fieldName: string, value: string) => {
      let validation: ValidationResult;
      
      switch (fieldName) {
        case 'firstName':
        case 'lastName':
          validation = validateName(value);
          if (validation.isValid && activeTab === 1) {
            // Check if combination of first and last name exists
            const otherName = fieldName === 'firstName' ? lastName : firstName;
            if (otherName && value) {
              const nameExists = await checkNameExists(
                fieldName === 'firstName' ? value : otherName,
                fieldName === 'lastName' ? value : otherName
              );
              if (nameExists) {
                validation = { isValid: false, errors: ['This name combination is already taken'] };
              }
            }
          }
          break;
        case 'email':
          validation = validateEmail(value);
          if (validation.isValid && activeTab === 1) {
            const emailExists = await checkEmailExists(value);
            if (emailExists) {
              validation = { isValid: false, errors: ['This email is already registered'] };
            }
          }
          break;
        case 'password':
          validation = validatePassword(value);
          setPasswordStrength(getPasswordStrength(value));
          break;
        case 'confirmPassword':
          validation = validatePasswordConfirmation(password, value);
          break;
        default:
          validation = { isValid: true, errors: [] };
      }
      
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: validation.errors
      }));
    }, 500),
    [firstName, lastName, password, activeTab]
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if email already exists
  const checkEmailExists = async (email: string): Promise<boolean> => {
    if (!email || email.length < 5) return false;
    
    try {
      setIsCheckingEmail(true);
      const response = await axios.post('/api/auth/check-email', { email });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Check if name already exists
  const checkNameExists = async (firstName: string, lastName: string): Promise<boolean> => {
    if (!firstName || !lastName) return false;
    
    try {
      setIsCheckingName(true);
      const response = await axios.post('/api/auth/check-name', { firstName, lastName });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking name:', error);
      return false;
    } finally {
      setIsCheckingName(false);
    }
  };

  // Handle field changes with validation
  const handleFieldChange = (fieldName: string, value: string) => {
    // Reset demo account flag when user manually types
    if (isDemoAccount && (fieldName === 'email' || fieldName === 'password')) {
      setIsDemoAccount(false);
    }
    
    switch (fieldName) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }

    // Mark field as touched
    setFieldTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Skip validation for demo accounts
    if (isDemoAccount && (fieldName === 'email' || fieldName === 'password')) {
      return;
    }
    
    // Validate field for non-demo accounts
    if (value.length > 0) {
      validateFieldRealTime(fieldName, value);
    } else {
      setFieldErrors(prev => ({ ...prev, [fieldName]: [] }));
    }
  };

  // Handle field blur
  const handleFieldBlur = (fieldName: string, value: string) => {
    setFieldTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Skip validation for demo accounts
    if (isDemoAccount && (fieldName === 'email' || fieldName === 'password')) {
      return;
    }
    
    if (value.length > 0) {
      validateFieldRealTime(fieldName, value);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    if (activeTab === 0) {
      // Login form - skip validation for demo accounts
      if (isDemoAccount) {
        return email.length > 0 && password.length > 0;
      }
      return email.length > 0 && password.length > 0 && 
             fieldErrors.email.length === 0 && fieldErrors.password.length === 0;
    } else {
      // Signup form - always validate (demo accounts don't affect signup)
      return firstName.length > 0 && lastName.length > 0 && email.length > 0 && 
             password.length > 0 && confirmPassword.length > 0 &&
             fieldErrors.firstName.length === 0 && fieldErrors.lastName.length === 0 &&
             fieldErrors.email.length === 0 && fieldErrors.password.length === 0 &&
             fieldErrors.confirmPassword.length === 0;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
    setIsDemoAccount(false); // Reset demo account flag when switching tabs
    
    // Reset form fields
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setRole('student');
    
    // Reset validation states
    setFieldErrors({
      firstName: [],
      lastName: [],
      email: [],
      password: [],
      confirmPassword: []
    });
    
    setFieldTouched({
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      confirmPassword: false
    });
    
    setPasswordStrength({ strength: 'weak', score: 0 });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Skip validation for demo accounts
    if (!isDemoAccount) {
      // Validate form before submission for non-demo accounts
      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(password);
      
      if (!emailValidation.isValid || !passwordValidation.isValid) {
        setFieldErrors({
          ...fieldErrors,
          email: emailValidation.errors,
          password: passwordValidation.errors
        });
        setError('Please fix the validation errors before submitting');
        return;
      }
    }
    
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      setSuccess('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } catch (err: any) {
      console.error('Login Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(`Login failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const firstNameValidation = validateName(firstName);
    const lastNameValidation = validateName(lastName);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validatePasswordConfirmation(password, confirmPassword);
    
    // Check for any validation errors
    const hasErrors = !firstNameValidation.isValid || !lastNameValidation.isValid || 
                     !emailValidation.isValid || !passwordValidation.isValid || 
                     !confirmPasswordValidation.isValid;
    
    if (hasErrors) {
      setFieldErrors({
        firstName: firstNameValidation.errors,
        lastName: lastNameValidation.errors,
        email: emailValidation.errors,
        password: passwordValidation.errors,
        confirmPassword: confirmPasswordValidation.errors
      });
      setError('Please fix all validation errors before submitting');
      return;
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setFieldErrors(prev => ({ ...prev, email: ['This email is already registered'] }));
      setError('Email already exists. Please use a different email or try logging in.');
      return;
    }

    // Check if name combination already exists
    const nameExists = await checkNameExists(firstName, lastName);
    if (nameExists) {
      setFieldErrors(prev => ({ 
        ...prev, 
        firstName: ['This name combination is already taken'],
        lastName: ['This name combination is already taken']
      }));
      setError('This name combination is already taken. Please use different names.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/auth/register', {
        email: email.toLowerCase().trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
      });

      setSuccess('Account created successfully! Please log in.');
      setActiveTab(0); 
      
      // Reset form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setRole('student');
      
      // Reset validation states
      setFieldErrors({
        firstName: [],
        lastName: [],
        email: [],
        password: [],
        confirmPassword: []
      });
      
    } catch (err: any) {
      console.error('Registration Error:', err);
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
      setActiveTab(0);
      setIsDemoAccount(true); // Mark as demo account usage
      
      // Clear any existing validation errors for demo accounts
      setFieldErrors({
        firstName: [],
        lastName: [],
        email: [],
        password: [],
        confirmPassword: []
      });
      
      setError(''); // Clear any error messages
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
            {/* Demo Account Indicator */}
            {isDemoAccount && (
              <div className="demo-indicator">
                <span className="demo-text">🎯 Demo Account Selected - Validation Bypassed</span>
              </div>
            )}

            {/* Error/Success Messages */}
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
                <div className="input-group">
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={(e) => handleFieldBlur('email', e.target.value)}
                    className={!isDemoAccount && fieldTouched.email && fieldErrors.email.length > 0 ? 'error' : ''}
                    required 
                  />
                  {!isDemoAccount && fieldTouched.email && fieldErrors.email.length > 0 && (
                    <div className="validation-errors">
                      {fieldErrors.email.map((error, index) => (
                        <span key={index} className="error-text">{error}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="input-group">
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={(e) => handleFieldBlur('password', e.target.value)}
                    className={!isDemoAccount && fieldTouched.password && fieldErrors.password.length > 0 ? 'error' : ''}
                    required 
                  />
                  {!isDemoAccount && fieldTouched.password && fieldErrors.password.length > 0 && (
                    <div className="validation-errors">
                      {fieldErrors.password.map((error, index) => (
                        <span key={index} className="error-text">{error}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <button type="submit" disabled={loading || !isFormValid()}>
                  {loading ? 'Logging In...' : 'Log In'}
                </button>
              </>
            )}

            {/* Signup Form */}
            {activeTab === 1 && (
              <>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="firstName" 
                    id="firstName" 
                    placeholder="First Name (max 20 characters)" 
                    value={firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    onBlur={(e) => handleFieldBlur('firstName', e.target.value)}
                    className={fieldTouched.firstName && fieldErrors.firstName.length > 0 ? 'error' : ''}
                    maxLength={20}
                    required 
                  />
                  {isCheckingName && <span className="checking-text">Checking availability...</span>}
                  {fieldTouched.firstName && fieldErrors.firstName.length > 0 && (
                    <div className="validation-errors">
                      {fieldErrors.firstName.map((error, index) => (
                        <span key={index} className="error-text">{error}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="input-group">
                  <input 
                    type="text" 
                    name="lastName" 
                    id="lastName" 
                    placeholder="Last Name (max 20 characters)" 
                    value={lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    onBlur={(e) => handleFieldBlur('lastName', e.target.value)}
                    className={fieldTouched.lastName && fieldErrors.lastName.length > 0 ? 'error' : ''}
                    maxLength={20}
                    required 
                  />
                  {fieldTouched.lastName && fieldErrors.lastName.length > 0 && (
                    <div className="validation-errors">
                      {fieldErrors.lastName.map((error, index) => (
                        <span key={index} className="error-text">{error}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="input-group">
                  <input 
                    type="email" 
                    name="email" 
                    id="signupEmail" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={(e) => handleFieldBlur('email', e.target.value)}
                    className={fieldTouched.email && fieldErrors.email.length > 0 ? 'error' : ''}
                    required 
                  />
                  {isCheckingEmail && <span className="checking-text">Checking availability...</span>}
                  {fieldTouched.email && fieldErrors.email.length > 0 && (
                    <div className="validation-errors">
                      {fieldErrors.email.map((error, index) => (
                        <span key={index} className="error-text">{error}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="input-group">
                  <input 
                    type="password" 
                    name="password" 
                    id="signupPassword" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={(e) => handleFieldBlur('password', e.target.value)}
                    className={fieldTouched.password && fieldErrors.password.length > 0 ? 'error' : ''}
                    required 
                  />
                  
                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <div className="password-strength">
                      <div className="strength-label">
                        Password Strength: 
                        <Chip 
                          label={passwordStrength.strength.toUpperCase()} 
                          size="small"
                          color={
                            passwordStrength.strength === 'weak' ? 'error' :
                            passwordStrength.strength === 'fair' ? 'warning' :
                            passwordStrength.strength === 'good' ? 'info' : 'success'
                          }
                          sx={{ ml: 1, fontSize: '10px' }}
                        />
                      </div>
                      <LinearProgress 
                        variant="determinate" 
                        value={(passwordStrength.score / 8) * 100}
                        color={
                          passwordStrength.strength === 'weak' ? 'error' :
                          passwordStrength.strength === 'fair' ? 'warning' :
                          passwordStrength.strength === 'good' ? 'info' : 'success'
                        }
                        sx={{ mt: 0.5 }}
                      />
                    </div>
                  )}
                  
                  {fieldTouched.password && fieldErrors.password.length > 0 && (
                    <div className="validation-errors">
                      {fieldErrors.password.map((error, index) => (
                        <span key={index} className="error-text">{error}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="input-group">
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    id="confirmPassword" 
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                    onBlur={(e) => handleFieldBlur('confirmPassword', e.target.value)}
                    className={fieldTouched.confirmPassword && fieldErrors.confirmPassword.length > 0 ? 'error' : ''}
                    required 
                  />
                  {fieldTouched.confirmPassword && fieldErrors.confirmPassword.length > 0 && (
                    <div className="validation-errors">
                      {fieldErrors.confirmPassword.map((error, index) => (
                        <span key={index} className="error-text">{error}</span>
                      ))}
                    </div>
                  )}
                </div>
                
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
                
                <button type="submit" disabled={loading || !isFormValid() || isCheckingEmail || isCheckingName}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </>
            )}            {}
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
