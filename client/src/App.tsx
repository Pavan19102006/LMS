import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import CourseList from './components/Courses/CourseList';
import CourseDetail from './components/Courses/CourseDetail';
import UserManagement from './components/Admin/UserManagement';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import './App.css';

// Create a system-aware theme that adapts to light/dark mode
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
            default: prefersDarkMode ? '#121212' : '#fafafa',
            paper: prefersDarkMode ? '#1e1e1e' : '#ffffff',
          },
          text: {
            primary: prefersDarkMode ? '#ffffff' : '#000000',
            secondary: prefersDarkMode ? '#aaaaaa' : '#666666',
          },
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

// Layout component that conditionally renders navbar
const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="App">
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
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
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
