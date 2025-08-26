import React, { useState, ChangeEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  Slide,
  Zoom,
  SelectChangeEvent
} from '@mui/material';
import { Login as LoginIcon, PersonAdd as SignUpIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axios';

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
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
      await axios.post('/api/auth/register', {
        email,
        password,
        firstName,
        lastName,
        role,
      });

      setSuccess('Account created successfully! Please log in.');
      setActiveTab(0); // Switch to login tab
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setRole('student');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      
      {/* Falling Stars Layer */}
      <div className="falling-stars">
        <div className="falling-star"></div>
        <div className="falling-star"></div>
        <div className="falling-star"></div>
        <div className="falling-star"></div>
        <div className="falling-star"></div>
        <div className="falling-star"></div>
        <div className="falling-star"></div>
        <div className="falling-star"></div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        width: '100%',
        maxWidth: '500px',
        zIndex: 1001,
        position: 'relative'
      }}>        {/* Main Login/Signup Card */}
        <Fade in={true} timeout={1000}>
          <Card sx={{ 
            minWidth: 450, 
            maxWidth: 600, 
            width: '100%',
            overflow: 'visible',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.1)'
          }}>
          <Zoom in={true} timeout={800} style={{ transitionDelay: '200ms' }}>
            <Box>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                centered
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'rgba(255, 215, 0, 0.3)',
                  '& .MuiTab-root': {
                    minWidth: 120,
                    transition: 'all 0.3s ease',
                    color: '#FFD700',
                    fontWeight: 'bold',
                    '&:hover': {
                      color: '#FFED4A',
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                    },
                    '&.Mui-selected': {
                      color: '#FFD700',
                      textShadow: '0 0 15px rgba(255, 215, 0, 0.6)'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#FFD700',
                    height: '3px',
                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                  }
                }}
              >
                <Tab 
                  icon={<LoginIcon sx={{ color: '#FFD700' }} />} 
                  label="Login" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<SignUpIcon sx={{ color: '#FFD700' }} />} 
                  label="Sign Up" 
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          </Zoom>

          <CardContent sx={{ 
            p: 4, 
            minHeight: 500,
            background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)'
          }}>
            <Slide 
              direction="right" 
              in={activeTab === 0} 
              timeout={500}
              mountOnEnter 
              unmountOnExit
            >
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom 
                  align="center"
                  sx={{
                    color: '#FFD700',
                    fontWeight: 'bold',
                    textShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                    fontSize: '2.5rem',
                    background: 'linear-gradient(45deg, #FFD700 30%, #FFED4A 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography 
                  variant="body2" 
                  align="center" 
                  sx={{ 
                    mb: 3,
                    color: '#C9B037',
                    fontSize: '1rem',
                    fontStyle: 'italic',
                    textShadow: '0 0 10px rgba(201, 176, 55, 0.3)'
                  }}
                >
                  Sign in to your Learning Management System
                </Typography>
                
                {error && (
                  <Fade in={!!error}>
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                  </Fade>
                )}
                
                {success && (
                  <Fade in={!!success}>
                    <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
                  </Fade>
                )}
                
                <Box component="form" onSubmit={handleLogin}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    autoFocus
                    className="gold-textfield"
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    margin="normal"
                    required
                    className="gold-textfield"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 3, 
                      mb: 2,
                      height: 48,
                      transition: 'all 0.3s ease',
                      background: 'linear-gradient(45deg, #FFD700 30%, #FFED4A 90%)',
                      color: '#1a1a1a',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                      border: '2px solid rgba(255, 215, 0, 0.5)',
                      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        background: 'linear-gradient(45deg, #FFED4A 30%, #FFD700 90%)',
                        boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                        border: '2px solid rgba(255, 215, 0, 0.8)',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 215, 0, 0.3)',
                        color: 'rgba(26, 26, 26, 0.5)',
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: '#1a1a1a' }} /> : '✨ Sign In ✨'}
                  </Button>
                </Box>
              </Box>
            </Slide>

            <Slide 
              direction="left" 
              in={activeTab === 1} 
              timeout={500}
              mountOnEnter 
              unmountOnExit
            >
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom 
                  align="center"
                  sx={{
                    color: '#FFD700',
                    fontWeight: 'bold',
                    textShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                    fontSize: '2.5rem',
                    background: 'linear-gradient(45deg, #FFD700 30%, #FFED4A 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Join Our Platform
                </Typography>
                <Typography 
                  variant="body2" 
                  align="center" 
                  sx={{ 
                    mb: 3,
                    color: '#C9B037',
                    fontSize: '1rem',
                    fontStyle: 'italic',
                    textShadow: '0 0 10px rgba(201, 176, 55, 0.3)'
                  }}
                >
                  Create your account to start learning
                </Typography>
                
                {error && (
                  <Fade in={!!error}>
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                  </Fade>
                )}
                
                {success && (
                  <Fade in={!!success}>
                    <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
                  </Fade>
                )}
                
                <Box component="form" onSubmit={handleSignup}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={firstName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                      margin="normal"
                      required
                      autoFocus
                      className="gold-textfield"
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={lastName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                      margin="normal"
                      required
                      className="gold-textfield"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    className="gold-textfield"
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    margin="normal"
                    required
                    helperText="Password must be at least 6 characters"
                    className="gold-textfield"
                    sx={{
                      '& .MuiFormHelperText-root': {
                        color: '#C9B037 !important',
                        fontStyle: 'italic'
                      }
                    }}
                  />
                  <FormControl fullWidth margin="normal" className="gold-textfield">
                    <InputLabel sx={{ color: '#C9B037', '&.Mui-focused': { color: '#FFD700' } }}>Role</InputLabel>
                    <Select
                      value={role}
                      onChange={(e: SelectChangeEvent) => setRole(e.target.value)}
                      label="Role"
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                        '& .MuiSelect-select': {
                          color: '#FFD700'
                        }
                      }}
                    >
                      <MenuItem value="student" sx={{ color: '#FFD700', '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.1)' } }}>🎓 Student</MenuItem>
                      <MenuItem value="instructor" sx={{ color: '#FFD700', '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.1)' } }}>👨‍🏫 Instructor</MenuItem>
                      <MenuItem value="content_creator" sx={{ color: '#FFD700', '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.1)' } }}>✍️ Content Creator</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 3, 
                      mb: 2,
                      height: 48,
                      transition: 'all 0.3s ease',
                      background: 'linear-gradient(45deg, #FFD700 30%, #FFED4A 90%)',
                      color: '#1a1a1a',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                      border: '2px solid rgba(255, 215, 0, 0.5)',
                      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        background: 'linear-gradient(45deg, #FFED4A 30%, #FFD700 90%)',
                        boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                        border: '2px solid rgba(255, 215, 0, 0.8)',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 215, 0, 0.3)',
                        color: 'rgba(26, 26, 26, 0.5)',
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: '#1a1a1a' }} /> : '🎉 Create Account 🎉'}
                  </Button>
                </Box>
              </Box>
            </Slide>
          </CardContent>
        </Card>
      </Fade>

      {/* Demo Accounts Selection Box */}
      <Fade in={true} timeout={800} style={{ transitionDelay: '400ms' }}>
        <Box 
          className="demo-accounts-container"
          sx={{ 
            p: 2, 
            textAlign: 'center', 
            backgroundColor: '#0f0f0f',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5), 0 4px 20px rgba(255, 215, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '400px',
            width: '100%'
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#FFD700',
              fontWeight: 'bold',
              marginBottom: 2,
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
              fontSize: '0.85rem'
            }}
          >
            ⚡ Quick Demo Access ⚡
          </Typography>
          
          <FormControl 
            fullWidth 
            size="small"
            className="gold-textfield"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 215, 0, 0.08)',
                '& fieldset': {
                  borderColor: 'rgba(255, 215, 0, 0.4)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 215, 0, 0.7)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#C9B037',
                fontSize: '0.875rem',
                '&.Mui-focused': {
                  color: '#FFD700',
                },
              },
              '& .MuiSelect-select': {
                color: '#FFD700',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              },
              '& .MuiSvgIcon-root': {
                color: '#FFD700',
              },
            }}
          >
            <InputLabel id="demo-account-select-label">Select Demo Account</InputLabel>
            <Select
              labelId="demo-account-select-label"
              value=""
              label="Select Demo Account"
              onChange={(e: SelectChangeEvent) => {
                const selectedAccount = e.target.value as string;
                if (selectedAccount) {
                  const [email, password] = selectedAccount.split('|');
                  setEmail(email);
                  setPassword(password);
                  setActiveTab(0); // Switch to login tab
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    '& .MuiMenuItem-root': {
                      color: '#FFD700',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 215, 0, 0.2)',
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="admin@lms.com|admin123">
                👑 Admin - admin@lms.com
              </MenuItem>
              <MenuItem value="instructor@lms.com|instructor123">
                👨‍🏫 Instructor - instructor@lms.com
              </MenuItem>
              <MenuItem value="student@lms.com|student123">
                🎓 Student - student@lms.com
              </MenuItem>
              <MenuItem value="creator@lms.com|creator123">
                ✍️ Creator - creator@lms.com
              </MenuItem>
            </Select>
          </FormControl>
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#C9B037',
              fontSize: '0.7rem',
              fontStyle: 'italic',
              mt: 1,
              display: 'block',
              opacity: 0.8
            }}
          >
            Select an account to auto-fill login credentials
          </Typography>
        </Box>
      </Fade>
      </div>
    </div>
  );
};

export default Login;
