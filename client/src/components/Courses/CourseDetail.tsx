import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { PlayCircle, Assignment, People } from '@mui/icons-material';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  
  const course = {
    id: id,
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern web applications.',
    instructor: 'John Smith',
    duration: '8 weeks',
    level: 'Beginner',
    enrolled: 45,
    maxStudents: 50,
    thumbnail: '/course-thumbnail.jpg',
    lessons: [
      { id: 1, title: 'Introduction to HTML', duration: '45 min', completed: true },
      { id: 2, title: 'CSS Basics', duration: '60 min', completed: true },
      { id: 3, title: 'JavaScript Fundamentals', duration: '90 min', completed: false },
      { id: 4, title: 'DOM Manipulation', duration: '75 min', completed: false },
      { id: 5, title: 'Responsive Design', duration: '80 min', completed: false },
    ],
    assignments: [
      { id: 1, title: 'HTML Structure Assignment', dueDate: '2025-09-15', submitted: true },
      { id: 2, title: 'CSS Styling Project', dueDate: '2025-09-22', submitted: false },
      { id: 3, title: 'JavaScript Calculator', dueDate: '2025-09-29', submitted: false },
    ],
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h1" gutterBottom>
                  {course.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip 
                    label={course.level} 
                    color={getLevelColor(course.level) as any}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {course.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.enrolled}/{course.maxStudents} enrolled
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {course.description}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Instructor: {course.instructor}
                </Typography>
                <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                  Start Learning
                </Button>
                <Button variant="outlined">
                  Preview Course
                </Button>
              </CardContent>
            </Card>

            {}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Course Content
                </Typography>
                <List>
                  {course.lessons.map((lesson, index) => (
                    <React.Fragment key={lesson.id}>
                      <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                        <PlayCircle 
                          color={lesson.completed ? "success" : "disabled"} 
                          sx={{ mr: 2 }} 
                        />
                        <ListItemText
                          primary={lesson.title}
                          secondary={lesson.duration}
                          sx={{ 
                            textDecoration: lesson.completed ? 'line-through' : 'none',
                            opacity: lesson.completed ? 0.7 : 1 
                          }}
                        />
                        {lesson.completed && (
                          <Chip label="Completed" color="success" size="small" />
                        )}
                      </ListItem>
                      {index < course.lessons.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {}
          <Grid item xs={12} md={4}>
            {}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Progress
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h4" color="primary">
                    40%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    Complete
                  </Typography>
                </Box>
                <Typography variant="body2">
                  2 of 5 lessons completed
                </Typography>
              </CardContent>
            </Card>

            {}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Assignments
                </Typography>
                <List dense>
                  {course.assignments.map((assignment) => (
                    <ListItem key={assignment.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={assignment.title}
                        secondary={`Due: ${assignment.dueDate}`}
                        sx={{
                          textDecoration: assignment.submitted ? 'line-through' : 'none',
                          opacity: assignment.submitted ? 0.7 : 1
                        }}
                      />
                      <Chip 
                        label={assignment.submitted ? "Submitted" : "Pending"} 
                        color={assignment.submitted ? "success" : "warning"}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <People sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Class Information
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Students Enrolled:</strong> {course.enrolled}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Duration:</strong> {course.duration}
                </Typography>
                <Typography variant="body2">
                  <strong>Level:</strong> {course.level}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CourseDetail;
