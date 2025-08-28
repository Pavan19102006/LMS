import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar
} from '@mui/material';
import {
  School,
  People,
  Assignment,
  Analytics,
  MenuBook as BookIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coursesDialogOpen, setCoursesDialogOpen] = useState(false);

  // Mock enrolled courses data (in a real app, this would come from an API)
  const enrolledCourses = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      instructor: "Dr. Smith",
      progress: 78,
      totalLessons: 24,
      completedLessons: 18,
      nextLesson: "Data Structures",
      color: "#1976d2"
    },
    {
      id: 2,
      title: "Web Development Fundamentals",
      instructor: "Prof. Johnson",
      progress: 92,
      totalLessons: 20,
      completedLessons: 18,
      nextLesson: "React Hooks",
      color: "#388e3c"
    },
    {
      id: 3,
      title: "Database Design",
      instructor: "Dr. Williams",
      progress: 45,
      totalLessons: 16,
      completedLessons: 7,
      nextLesson: "Normalization",
      color: "#f57c00"
    },
    {
      id: 4,
      title: "Machine Learning Basics",
      instructor: "Prof. Davis",
      progress: 23,
      totalLessons: 30,
      completedLessons: 7,
      nextLesson: "Linear Regression",
      color: "#7b1fa2"
    },
    {
      id: 5,
      title: "Software Engineering",
      instructor: "Dr. Brown",
      progress: 67,
      totalLessons: 22,
      completedLessons: 15,
      nextLesson: "Testing Strategies",
      color: "#d32f2f"
    },
    {
      id: 6,
      title: "Mobile App Development",
      instructor: "Prof. Wilson",
      progress: 89,
      totalLessons: 18,
      completedLessons: 16,
      nextLesson: "App Store Deployment",
      color: "#0288d1"
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSubmitAssignmentClick = () => {
    // Open file manager for assignment submission
    fileInputRef.current?.click();
  };

  const handleBrowseCoursesClick = () => {
    setCoursesDialogOpen(true);
  };

  const handleCoursesDialogClose = () => {
    setCoursesDialogOpen(false);
  };

  const handleViewAllCourses = () => {
    setCoursesDialogOpen(false);
    navigate('/courses');
  };

  const handleEnrolledCoursesClick = () => {
    // Directly open the courses dialog
    setCoursesDialogOpen(true);
  };

  const handleAssignmentsDueClick = () => {
    // Navigate to assignments page
    navigate('/assignments');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      console.log('Selected files:', files);
      // Here you can handle the file upload logic
      // For now, we'll show an alert with file names
      const fileNames = files.map(file => file.name).join(', ');
      alert(`Selected files: ${fileNames}\n\nNote: Complete assignment submission will be available in the Assignments section.`);
      
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                    borderColor: 'primary.main'
                  }
                }}
                onClick={handleEnrolledCoursesClick}
              >
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
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                    borderColor: 'primary.main'
                  }
                }}
                onClick={handleAssignmentsDueClick}
              >
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Assignment color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Assignments Due
                      </Typography>
                      <Typography variant="h4">0</Typography>
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
        
        <Box sx={{ mt: 4 }} id="quick-actions">
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
                  <Card 
                    id="browse-courses-card"
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { boxShadow: 3 }
                    }}
                    onClick={handleBrowseCoursesClick}
                  >
                    <CardContent>
                      <Typography variant="h6">
                        Browse Courses
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        View your enrolled courses
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card 
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { boxShadow: 3 }
                    }}
                    onClick={handleSubmitAssignmentClick}
                  >
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
        
        {/* Hidden file input for assignment submission */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
        />

        {/* Enrolled Courses Dialog */}
        <Dialog 
          open={coursesDialogOpen} 
          onClose={handleCoursesDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <School color="primary" />
              <Typography variant="h6">Your Enrolled Courses</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <List>
              {enrolledCourses.map((course, index) => (
                <React.Fragment key={course.id}>
                  <ListItem 
                    sx={{ 
                      py: 2,
                      '&:hover': { 
                        backgroundColor: 'action.hover',
                        borderRadius: 1
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Avatar 
                        sx={{ 
                          bgcolor: course.color,
                          width: 56,
                          height: 56
                        }}
                      >
                        <BookIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="div">
                          {course.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Instructor: {course.instructor}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Typography variant="body2">
                              Progress: {course.progress}%
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              ({course.completedLessons}/{course.totalLessons} lessons)
                            </Typography>
                          </Box>
                          <Box 
                            sx={{ 
                              width: '100%', 
                              height: 6, 
                              backgroundColor: 'grey.300',
                              borderRadius: 3,
                              mb: 1
                            }}
                          >
                            <Box
                              sx={{
                                width: `${course.progress}%`,
                                height: '100%',
                                backgroundColor: course.color,
                                borderRadius: 3,
                                transition: 'width 0.3s ease'
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="primary">
                            Next: {course.nextLesson}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < enrolledCourses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCoursesDialogClose} color="primary">
              Close
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleViewAllCourses}
            >
              View All Courses
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Dashboard;
