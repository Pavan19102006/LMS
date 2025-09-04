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
  courseCode: string;
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

  
  useEffect(() => {
    const kluCourses: Course[] = [
      {
        id: '1',
        courseCode: '23UC0013',
        title: 'Global Logic Building Contest Practicum',
        description: 'Develop logical thinking and problem-solving skills through competitive programming contests and practical exercises.',
        instructor: 'CSE-1 Department',
        duration: '12 weeks',
        level: 'Intermediate',
        enrolled: 45,
        maxStudents: 60,
      },
      {
        id: '2',
        courseCode: '24AD2103R',
        title: 'Database Management Systems',
        description: 'Comprehensive study of database design, SQL, normalization, and modern database technologies.',
        instructor: 'AI&DS Department',
        duration: '24 weeks',
        level: 'Intermediate',
        enrolled: 52,
        maxStudents: 60,
      },
      {
        id: '3',
        courseCode: '24CS2101R',
        title: 'Operating Systems',
        description: 'Study of operating system concepts including process management, memory management, and file systems.',
        instructor: 'CSE-1 Department',
        duration: '20 weeks',
        level: 'Intermediate',
        enrolled: 48,
        maxStudents: 55,
      },
      {
        id: '4',
        courseCode: '24SC2006',
        title: 'Object Oriented Programming',
        description: 'Learn object-oriented programming concepts, design patterns, and software development best practices.',
        instructor: 'CSE-3 Department',
        duration: '18 weeks',
        level: 'Beginner',
        enrolled: 55,
        maxStudents: 60,
      },
      {
        id: '5',
        courseCode: '24DT01F',
        title: 'Entrepreneurial Technology Development and Prototyping',
        description: 'Develop entrepreneurial skills and learn to create technology prototypes for innovative business solutions.',
        instructor: 'MDI&E Department',
        duration: '16 weeks',
        level: 'Advanced',
        enrolled: 28,
        maxStudents: 40,
      },
      {
        id: '6',
        courseCode: '24SDC801A',
        title: 'Front End Development Frameworks',
        description: 'Master modern frontend frameworks including React, Angular, and Vue.js for web application development.',
        instructor: 'CS&IT Department',
        duration: '22 weeks',
        level: 'Advanced',
        enrolled: 42,
        maxStudents: 50,
      },
      {
        id: '7',
        courseCode: '24AD2001A',
        title: 'Artificial Intelligence and Machine Learning',
        description: 'Explore AI concepts, machine learning algorithms, neural networks, and deep learning applications.',
        instructor: 'AI&DS Department',
        duration: '30 weeks',
        level: 'Advanced',
        enrolled: 38,
        maxStudents: 45,
      },
      {
        id: '8',
        courseCode: '24MT2012',
        title: 'Mathematical Optimization',
        description: 'Study optimization techniques, linear programming, and mathematical modeling for problem solving.',
        instructor: 'AI&DS Department',
        duration: '25 weeks',
        level: 'Advanced',
        enrolled: 35,
        maxStudents: 40,
      },
    ];
    
    setTimeout(() => {
      setCourses(kluCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    
    console.log('Enrolling in course:', courseId);
  };

  const handleCreateCourse = () => {
    
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
              <Card className="dashboard-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {course.courseCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {course.description}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Department:</strong> {course.instructor}
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
