import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Fab,
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolled: number;
  maxStudents: number;
  thumbnail?: string;
}

const CourseList: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of HTML, CSS, and JavaScript',
        instructor: 'John Smith',
        duration: '8 weeks',
        level: 'Beginner',
        enrolled: 45,
        maxStudents: 50,
      },
      {
        id: '2',
        title: 'Advanced React Development',
        description: 'Master React hooks, context, and state management',
        instructor: 'Sarah Johnson',
        duration: '12 weeks',
        level: 'Advanced',
        enrolled: 28,
        maxStudents: 30,
      },
      {
        id: '3',
        title: 'Database Design and SQL',
        description: 'Learn database modeling and SQL query optimization',
        instructor: 'Mike Davis',
        duration: '10 weeks',
        level: 'Intermediate',
        enrolled: 35,
        maxStudents: 40,
      },
      {
        id: '4',
        title: 'Python Programming Basics',
        description: 'Start your programming journey with Python',
        instructor: 'Lisa Wilson',
        duration: '6 weeks',
        level: 'Beginner',
        enrolled: 52,
        maxStudents: 60,
      },
      {
        id: '5',
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to ML algorithms and applications',
        instructor: 'Dr. Robert Chen',
        duration: '14 weeks',
        level: 'Advanced',
        enrolled: 18,
        maxStudents: 25,
      },
    ];
    
    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  const handleEnroll = (courseId: string) => {
    // In real app, this would make an API call
    console.log('Enrolling in course:', courseId);
  };

  const handleCreateCourse = () => {
    // Navigate to course creation form
    console.log('Creating new course');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <Typography>Loading courses...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Courses
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {course.description}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Instructor:</strong> {course.instructor}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Duration:</strong> {course.duration}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip 
                      label={course.level} 
                      color={getLevelColor(course.level) as any}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {course.enrolled}/{course.maxStudents} enrolled
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  {user?.role === 'student' ? (
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => handleEnroll(course.id)}
                      disabled={course.enrolled >= course.maxStudents}
                    >
                      {course.enrolled >= course.maxStudents ? 'Full' : 'Enroll'}
                    </Button>
                  ) : (
                    <Button size="small" variant="outlined">
                      View Details
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredCourses.length === 0 && (
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No courses found matching your search.
            </Typography>
          </Box>
        )}

        {(user?.role === 'instructor' || user?.role === 'admin') && (
          <Fab
            color="primary"
            aria-label="add course"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={handleCreateCourse}
          >
            <Add />
          </Fab>
        )}
      </Box>
    </Container>
  );
};

export default CourseList;
