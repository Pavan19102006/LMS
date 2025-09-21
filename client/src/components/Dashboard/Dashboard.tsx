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
import UserManagement from '../Admin/UserManagement';
// REMOVED: Unused imports
// import CourseManagement from '../Instructor/CourseManagement';
// import StudentManagement from '../Instructor/StudentManagement';
// import InstructorAnalytics from '../Instructor/InstructorAnalytics';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coursesDialogOpen, setCoursesDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  
  const enrolledCourses = [
    {
      id: 1,
      courseCode: "23UC0013",
      title: "Global Logic Building Contest Practicum",
      instructor: "CSE-1 Department",
      progress: 85,
      totalLessons: 12,
      completedLessons: 10,
      nextLesson: "Contest Preparation",
      color: "#1976d2"
    },
    {
      id: 2,
      courseCode: "24AD2103R",
      title: "Database Management Systems",
      instructor: "AI&DS Department",
      progress: 78,
      totalLessons: 24,
      completedLessons: 18,
      nextLesson: "Normalization Techniques",
      color: "#388e3c"
    },
    {
      id: 3,
      courseCode: "24CS2101R",
      title: "Operating Systems",
      instructor: "CSE-1 Department",
      progress: 65,
      totalLessons: 20,
      completedLessons: 13,
      nextLesson: "Process Scheduling",
      color: "#f57c00"
    },
    {
      id: 4,
      courseCode: "24SC2006",
      title: "Object Oriented Programming",
      instructor: "CSE-3 Department",
      progress: 92,
      totalLessons: 18,
      completedLessons: 16,
      nextLesson: "Design Patterns",
      color: "#7b1fa2"
    },
    {
      id: 5,
      courseCode: "24DT01F",
      title: "Entrepreneurial Technology Development and Prototyping",
      instructor: "MDI&E Department",
      progress: 45,
      totalLessons: 16,
      completedLessons: 7,
      nextLesson: "Prototype Development",
      color: "#d32f2f"
    },
    {
      id: 6,
      courseCode: "24SDC801A",
      title: "Front End Development Frameworks",
      instructor: "CS&IT Department",
      progress: 88,
      totalLessons: 22,
      completedLessons: 19,
      nextLesson: "React Advanced Concepts",
      color: "#0288d1"
    },
    {
      id: 7,
      courseCode: "24AD2001A",
      title: "Artificial Intelligence and Machine Learning",
      instructor: "AI&DS Department",
      progress: 72,
      totalLessons: 30,
      completedLessons: 21,
      nextLesson: "Neural Networks",
      color: "#689f38"
    },
    {
      id: 8,
      courseCode: "24MT2012",
      title: "Mathematical Optimization",
      instructor: "AI&DS Department",
      progress: 58,
      totalLessons: 25,
      completedLessons: 14,
      nextLesson: "Linear Programming",
      color: "#5d4037"
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSubmitAssignmentClick = () => {
    
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
    
    setCoursesDialogOpen(true);
  };

  const handleAssignmentsDueClick = () => {
    
    navigate('/assignments');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      console.log('Selected files:', files);
      
      
      const fileNames = files.map(file => file.name).join(', ');
      alert(`Selected files: ${fileNames}\n\nNote: Complete assignment submission will be available in the Assignments section.`);
      
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case 'admin':
        if (activeTab === 'users') {
          return <UserManagement />;
        }
        return (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Button
                variant={activeTab === 'overview' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('overview')}
                sx={{ mr: 2, color: activeTab === 'overview' ? 'white' : 'white', borderColor: 'white' }}
              >
                Overview
              </Button>
              <Button
                variant={activeTab === 'users' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('users')}
                sx={{ color: activeTab === 'users' ? 'white' : 'white', borderColor: 'white' }}
              >
                User Management
              </Button>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  className="dashboard-card"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
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
                <Card 
                  className="dashboard-card"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
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
                <Card 
                  className="dashboard-card"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
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
              <Card 
                className="dashboard-card"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
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
        </Box>
        );
      case 'instructor':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                className="dashboard-card"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
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
              <Card 
                className="dashboard-card"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
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
              <Card 
                className="dashboard-card"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
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
                className="dashboard-card"
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
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
                      <Typography variant="h4">8</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                className="dashboard-card"
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
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
              <Card 
                className="dashboard-card"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
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
              <Card 
                className="dashboard-card"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
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
              <Card 
                className="dashboard-card"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
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
              <Card 
                className="dashboard-card"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
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
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          zIndex: -2
        }}
      />
      
      {}
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          opacity: 0.4,
          '@media (max-width: 768px)': {
            opacity: 0.3
          }
        }}
        onError={(e) => {
          console.error('Video failed to load:', e);
          
          (e.target as HTMLVideoElement).style.display = 'none';
        }}
        onLoadStart={() => {
          console.log('Video loading started');
        }}
        onCanPlay={() => {
          console.log('Video can play');
        }}
      >
        <source src={`${process.env.PUBLIC_URL}/83274-581386222.mp4`} type="video/mp4" />
        <source src="/83274-581386222.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </Box>
      
      {}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: -1
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              fontWeight: 'bold'
            }}
          >
            {getGreeting()}, {user?.firstName}!
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'white',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}
            >
              Role:
            </Typography>
            <Chip 
              label={user?.role?.replace('_', ' ').toUpperCase()} 
              color="primary" 
              variant="filled"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            />
          </Box>
        {getRoleBasedContent()}
        
        <Box sx={{ mt: 4 }} id="quick-actions">
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              fontWeight: 'bold'
            }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {user?.role === 'admin' && (
              <>
                <Grid item>
                  <Card 
                    className="dashboard-card" 
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { boxShadow: 6 },
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                    onClick={() => setActiveTab('users')}
                  >
                    <CardContent>
                      <Typography variant="h6">Manage Users</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Add, edit, or remove users
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card 
                    className="dashboard-card" 
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { boxShadow: 6 },
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
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
                  <Card 
                    className="dashboard-card" 
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { boxShadow: 6 },
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">Create Course</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Start a new course
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card 
                    className="dashboard-card" 
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { boxShadow: 6 },
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
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
                    className="dashboard-card"
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { boxShadow: 6 },
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
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
                    className="dashboard-card"
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { boxShadow: 6 },
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
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
            {user?.role === 'content_creator' && (
              <>
                <Grid item>
                  <Card 
                    className="dashboard-card" 
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { boxShadow: 6 },
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">Create Content</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Develop new learning materials
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card 
                    className="dashboard-card" 
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { boxShadow: 6 },
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">Manage Resources</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Organize your content library
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
        
        {}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
        />

        {}
        <Dialog 
          open={coursesDialogOpen} 
          onClose={handleCoursesDialogClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2
            }
          }}
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
                        <Box>
                          <Typography variant="h6" component="div">
                            {course.title}
                          </Typography>
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                            {course.courseCode}
                          </Typography>
                        </Box>
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
    </Box>
  );
};

export default Dashboard;