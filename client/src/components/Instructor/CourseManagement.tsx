import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Fab,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  School,
  People,
  Assignment,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axios';

interface Course {
  _id: string;
  title: string;
  description: string;
  courseCode: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  maxStudents: number;
  enrolledStudents: number;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
}

const CourseManagement: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseCode: '',
    level: 'Beginner' as Course['level'],
    duration: '',
    maxStudents: 50,
    status: 'active' as Course['status'],
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/courses/instructor');
      setCourses(response.data.courses || response.data || []);
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again.');
      // Fallback demo data
      setCourses([
        {
          _id: '1',
          title: 'Introduction to React',
          description: 'Learn the fundamentals of React development',
          courseCode: 'CS101',
          instructor: user?.firstName + ' ' + user?.lastName || 'Instructor',
          level: 'Beginner',
          duration: '8 weeks',
          maxStudents: 30,
          enrolledStudents: 25,
          status: 'active',
          createdAt: '2025-01-15',
        },
        {
          _id: '2',
          title: 'Advanced JavaScript',
          description: 'Deep dive into modern JavaScript concepts',
          courseCode: 'CS201',
          instructor: user?.firstName + ' ' + user?.lastName || 'Instructor',
          level: 'Advanced',
          duration: '12 weeks',
          maxStudents: 25,
          enrolledStudents: 20,
          status: 'active',
          createdAt: '2025-02-01',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        courseCode: course.courseCode,
        level: course.level,
        duration: course.duration,
        maxStudents: course.maxStudents,
        status: course.status,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        courseCode: '',
        level: 'Beginner',
        duration: '',
        maxStudents: 50,
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setError('');
  };

  const handleSaveCourse = async () => {
    try {
      setSaving(true);
      setError('');

      if (editingCourse) {
        await axios.put(`/api/courses/${editingCourse._id}`, formData);
        setCourses(courses.map(course => 
          course._id === editingCourse._id 
            ? { ...course, ...formData }
            : course
        ));
      } else {
        const response = await axios.post('/api/courses', formData);
        const newCourse: Course = {
          _id: response.data.course?._id || Date.now().toString(),
          ...formData,
          instructor: user?.firstName + ' ' + user?.lastName || 'Instructor',
          enrolledStudents: 0,
          createdAt: new Date().toISOString(),
        };
        setCourses([...courses, newCourse]);
      }

      handleCloseDialog();
    } catch (err: any) {
      console.error('Error saving course:', err);
      setError(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        setCourses(courses.filter(course => course._id !== courseId));
      } catch (err: any) {
        console.error('Error deleting course:', err);
        setError(err.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  const handleInputChange = (field: string) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'draft': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            My Courses
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchCourses}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <School color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Courses
                    </Typography>
                    <Typography variant="h4">{courses.length}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <People color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Students
                    </Typography>
                    <Typography variant="h4">
                      {courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Assignment color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Active Courses
                    </Typography>
                    <Typography variant="h4">
                      {courses.filter(course => course.status === 'active').length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Courses Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Code</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.courseCode}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{course.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {course.description.length > 50 
                        ? `${course.description.substring(0, 50)}...` 
                        : course.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={course.level} 
                      color={getLevelColor(course.level) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>
                    {course.enrolledStudents} / {course.maxStudents}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={course.status} 
                      color={getStatusColor(course.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(course)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteCourse(course._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="info"
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Course FAB */}
        <Fab
          color="primary"
          aria-label="add course"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => handleOpenDialog()}
        >
          <Add />
        </Fab>

        {/* Course Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingCourse ? 'Edit Course' : 'Create New Course'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Course Title"
                value={formData.title}
                onChange={handleInputChange('title')}
                fullWidth
                required
              />
              <TextField
                label="Course Code"
                value={formData.courseCode}
                onChange={handleInputChange('courseCode')}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                fullWidth
                multiline
                rows={3}
                required
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Level</InputLabel>
                    <Select
                      value={formData.level}
                      onChange={handleInputChange('level')}
                      label="Level"
                    >
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Duration"
                    value={formData.duration}
                    onChange={handleInputChange('duration')}
                    fullWidth
                    placeholder="e.g., 8 weeks"
                    required
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Max Students"
                    type="number"
                    value={formData.maxStudents}
                    onChange={handleInputChange('maxStudents')}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={handleInputChange('status')}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="draft">Draft</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSaveCourse} 
              variant="contained"
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} /> : (editingCourse ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CourseManagement;