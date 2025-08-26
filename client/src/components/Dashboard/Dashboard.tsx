import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
} from '@mui/material';
import {
  School,
  People,
  Assignment,
  Analytics,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <People color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Users
                      </Typography>
                      <Typography variant="h4">1,234</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <School color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Courses
                      </Typography>
                      <Typography variant="h4">87</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Assignment color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Active Assignments
                      </Typography>
                      <Typography variant="h4">156</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Analytics color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Platform Usage
                      </Typography>
                      <Typography variant="h4">94%</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      case 'instructor':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <School color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        My Courses
                      </Typography>
                      <Typography variant="h4">5</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <People color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Students
                      </Typography>
                      <Typography variant="h4">234</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Assignment color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Pending Grading
                      </Typography>
                      <Typography variant="h4">23</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      case 'student':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <School color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Enrolled Courses
                      </Typography>
                      <Typography variant="h4">6</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Assignment color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Assignments Due
                      </Typography>
                      <Typography variant="h4">3</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Analytics color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Overall Progress
                      </Typography>
                      <Typography variant="h4">78%</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      case 'content_creator':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <School color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Content Created
                      </Typography>
                      <Typography variant="h4">45</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Assignment color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Pending Reviews
                      </Typography>
                      <Typography variant="h4">7</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Analytics color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Quality Score
                      </Typography>
                      <Typography variant="h4">9.2</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {getGreeting()}, {user?.firstName}!
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Typography variant="body1" color="textSecondary">
            Role:
          </Typography>
          <Chip 
            label={user?.role?.replace('_', ' ').toUpperCase()} 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        
        {getRoleBasedContent()}
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {user?.role === 'admin' && (
              <>
                <Grid item>
                  <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                    <CardContent>
                      <Typography variant="h6">Manage Users</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Add, edit, or remove users
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                    <CardContent>
                      <Typography variant="h6">System Settings</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Configure platform settings
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
            {user?.role === 'instructor' && (
              <>
                <Grid item>
                  <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                    <CardContent>
                      <Typography variant="h6">Create Course</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Start a new course
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                    <CardContent>
                      <Typography variant="h6">Grade Assignments</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Review student submissions
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
            {user?.role === 'student' && (
              <>
                <Grid item>
                  <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                    <CardContent>
                      <Typography variant="h6">Browse Courses</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Find and enroll in courses
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                    <CardContent>
                      <Typography variant="h6">Submit Assignment</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Upload your work
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
