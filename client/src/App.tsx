import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  useMediaQuery, 
  Fab
} from '@mui/material';
import { SmartToy as RubyIcon } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import CourseList from './components/Courses/CourseList';
import CourseDetail from './components/Courses/CourseDetail';
import Assignments from './components/Assignments/Assignments';
import UserManagement from './components/Admin/UserManagement';
import UserProfile from './components/Profile/UserProfile';
import RubyAIChat from './components/AI/RubyAIChat';
import StarryBackground from './components/Common/StarryBackground';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import './App.css';


const useSystemTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: prefersDarkMode ? '#90caf9' : '#1976d2',
          },
          secondary: {
            main: prefersDarkMode ? '#f48fb1' : '#dc004e',
          },
          background: {
            default: prefersDarkMode ? '#0d1117' : '#fafafa',
            paper: prefersDarkMode ? '#161b22' : '#ffffff',
          },
          text: {
            primary: prefersDarkMode ? '#ffffff' : '#000000',
            secondary: prefersDarkMode ? '#8b949e' : '#666666',
          },
          divider: prefersDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: 'background-color 0.3s ease, color 0.3s ease',
              },
            },
          },
        },
      }),
    [prefersDarkMode],
  );

  return theme;
};


const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [rubyDialogOpen, setRubyDialogOpen] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { isAuthenticated } = useAuth();

  const handleRubyClick = () => {
    setRubyDialogOpen(true);
  };

  const handleRubyDialogClose = () => {
    setRubyDialogOpen(false);
  };

  return (
    <div className="App">
      {}
      {!isLoginPage && isAuthenticated && <StarryBackground />}
      
      {!isLoginPage && <Navbar />}
      <main className={isLoginPage ? '' : 'main-content'}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CourseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <Assignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {}
      {!isLoginPage && (
        <>
          <Fab
            color="secondary"
            aria-label="Ruby AI Assistant"
            onClick={handleRubyClick}
            className="ruby-fab"
            sx={{
              background: prefersDarkMode 
                ? 'linear-gradient(45deg, #e91e63 30%, #ff4081 90%)'
                : 'linear-gradient(45deg, #e91e63 30%, #ff4081 90%)',
              '&:hover': {
                background: prefersDarkMode
                  ? 'linear-gradient(45deg, #c2185b 30%, #f50057 90%)'
                  : 'linear-gradient(45deg, #c2185b 30%, #f50057 90%)',
              },
              transition: 'all 0.3s ease',
              boxShadow: prefersDarkMode
                ? '0 4px 20px rgba(233, 30, 99, 0.5)'
                : '0 4px 20px rgba(233, 30, 99, 0.3)',
            }}
          >
            <RubyIcon sx={{ color: 'white' }} />
          </Fab>

          {}
          <RubyAIChat
            open={rubyDialogOpen}
            onClose={handleRubyDialogClose}
          />
        </>
      )}
    </div>
  );
};

function App() {
  const theme = useSystemTheme();
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
