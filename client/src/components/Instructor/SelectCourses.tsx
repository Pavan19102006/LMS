import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Box
} from '@mui/material';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

interface Course {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

interface SelectCoursesProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SelectCourses: React.FC<SelectCoursesProps> = ({ open, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchCourses();
    }
  }, [open]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all courses (including unpublished ones for instructors)
      const allCoursesResponse = await axios.get('/api/courses', {
        params: { limit: 100, published: 'false' }
      });
      const allCourses = allCoursesResponse.data.courses || [];

      // Fetch courses already assigned to this instructor
      if (user?.id) {
        const myCoursesResponse = await axios.get(`/api/courses/instructor/${user.id}`);
        const myCourses = myCoursesResponse.data.courses || [];
        
        // Pre-select courses already assigned to this instructor
        const myCoursesIds = new Set<string>(myCourses.map((c: Course) => c._id || c.id));
        setSelectedCourses(myCoursesIds);
      }

      setCourses(allCourses);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError(error.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCourse = (courseId: string) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      // Update each selected course to assign this instructor
      const updatePromises = Array.from(selectedCourses).map(courseId =>
        axios.put(`/api/courses/${courseId}`, {
          instructor: user?.id
        })
      );

      await Promise.all(updatePromises);
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error assigning courses:', error);
      setError(error.response?.data?.message || 'Failed to assign courses');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedCourses(new Set());
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Select Courses to Teach
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Choose the courses you want to teach and create assignments for
        </Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : courses.length === 0 ? (
          <Alert severity="info">
            No courses available. Contact an administrator to create courses first.
          </Alert>
        ) : (
          <>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Selected: {selectedCourses.size} course(s)
            </Typography>
            <List>
              {courses.map((course) => {
                const courseId = course._id || course.id;
                const isSelected = selectedCourses.has(courseId);
                const hasInstructor = course.instructor && course.instructor._id !== user?.id;

                return (
                  <ListItem 
                    key={courseId}
                    divider
                    sx={{
                      opacity: hasInstructor ? 0.6 : 1,
                      backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          {course.title}
                          {hasInstructor && (
                            <Chip 
                              label={`Assigned to ${course.instructor?.firstName} ${course.instructor?.lastName}`}
                              size="small"
                              color="warning"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          {course.description}
                          <br />
                          <Chip label={course.category} size="small" sx={{ mt: 0.5, mr: 0.5 }} />
                          <Chip label={course.level} size="small" sx={{ mt: 0.5 }} />
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        checked={isSelected}
                        onChange={() => handleToggleCourse(courseId)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={saving || selectedCourses.size === 0}
        >
          {saving ? <CircularProgress size={24} /> : `Assign ${selectedCourses.size} Course(s)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectCourses;
