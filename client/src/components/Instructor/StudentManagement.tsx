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
  Rating,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Grade,
  Person,
  Assignment,
  School,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axios';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  courseId: string;
  courseName: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'dropped' | 'completed';
  grades: Grade[];
  averageGrade: number;
  attendance: number;
}

interface Grade {
  _id: string;
  assignmentName: string;
  score: number;
  maxScore: number;
  gradedDate: string;
  feedback?: string;
}

const StudentManagement: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [gradeData, setGradeData] = useState({
    assignmentName: '',
    score: 0,
    maxScore: 100,
    feedback: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/courses/students');
      setStudents(response.data.students || response.data || []);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please try again.');
      // Fallback demo data
      setStudents([
        {
          _id: '1',
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice.johnson@email.com',
          studentId: 'STU001',
          courseId: '1',
          courseName: 'Introduction to React',
          enrollmentDate: '2025-01-15',
          status: 'active',
          grades: [
            {
              _id: '1',
              assignmentName: 'Assignment 1',
              score: 85,
              maxScore: 100,
              gradedDate: '2025-01-20',
              feedback: 'Great work!',
            },
            {
              _id: '2',
              assignmentName: 'Quiz 1',
              score: 92,
              maxScore: 100,
              gradedDate: '2025-01-25',
              feedback: 'Excellent understanding',
            },
          ],
          averageGrade: 88.5,
          attendance: 95,
        },
        {
          _id: '2',
          firstName: 'Bob',
          lastName: 'Smith',
          email: 'bob.smith@email.com',
          studentId: 'STU002',
          courseId: '1',
          courseName: 'Introduction to React',
          enrollmentDate: '2025-01-16',
          status: 'active',
          grades: [
            {
              _id: '3',
              assignmentName: 'Assignment 1',
              score: 78,
              maxScore: 100,
              gradedDate: '2025-01-20',
              feedback: 'Good effort, needs improvement',
            },
          ],
          averageGrade: 78,
          attendance: 87,
        },
        {
          _id: '3',
          firstName: 'Carol',
          lastName: 'Davis',
          email: 'carol.davis@email.com',
          studentId: 'STU003',
          courseId: '2',
          courseName: 'Advanced JavaScript',
          enrollmentDate: '2025-02-01',
          status: 'active',
          grades: [],
          averageGrade: 0,
          attendance: 100,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGradeDialog = (student: Student) => {
    setSelectedStudent(student);
    setGradeData({
      assignmentName: '',
      score: 0,
      maxScore: 100,
      feedback: '',
    });
    setOpenGradeDialog(true);
  };

  const handleCloseGradeDialog = () => {
    setOpenGradeDialog(false);
    setSelectedStudent(null);
    setError('');
  };

  const handleAddGrade = async () => {
    if (!selectedStudent) return;

    try {
      setSaving(true);
      setError('');

      const newGrade: Grade = {
        _id: Date.now().toString(),
        ...gradeData,
        gradedDate: new Date().toISOString(),
      };

      await axios.post(`/api/students/${selectedStudent._id}/grades`, gradeData);

      // Update local state
      const updatedStudents = students.map(student => {
        if (student._id === selectedStudent._id) {
          const updatedGrades = [...student.grades, newGrade];
          const averageGrade = updatedGrades.reduce((sum, grade) => 
            sum + (grade.score / grade.maxScore) * 100, 0) / updatedGrades.length;
          
          return {
            ...student,
            grades: updatedGrades,
            averageGrade: Math.round(averageGrade * 10) / 10,
          };
        }
        return student;
      });

      setStudents(updatedStudents);
      handleCloseGradeDialog();
    } catch (err: any) {
      console.error('Error adding grade:', err);
      setError(err.response?.data?.message || 'Failed to add grade');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStudentStatus = async (studentId: string, newStatus: Student['status']) => {
    try {
      await axios.put(`/api/students/${studentId}/status`, { status: newStatus });
      
      setStudents(students.map(student => 
        student._id === studentId 
          ? { ...student, status: newStatus }
          : student
      ));
    } catch (err: any) {
      console.error('Error updating student status:', err);
      setError(err.response?.data?.message || 'Failed to update student status');
    }
  };

  const handleInputChange = (field: string) => (event: any) => {
    setGradeData({ ...gradeData, [field]: event.target.value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'dropped': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'success';
    if (grade >= 80) return 'info';
    if (grade >= 70) return 'warning';
    return 'error';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
            Student Management
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchStudents}
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
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Person color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Students
                    </Typography>
                    <Typography variant="h4">{students.length}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <School color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Active Students
                    </Typography>
                    <Typography variant="h4">
                      {students.filter(s => s.status === 'active').length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Grade color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Average Grade
                    </Typography>
                    <Typography variant="h4">
                      {students.length > 0 
                        ? Math.round(students.reduce((sum, s) => sum + s.averageGrade, 0) / students.length)
                        : 0}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Assignment color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Grades
                    </Typography>
                    <Typography variant="h4">
                      {students.reduce((sum, s) => sum + s.grades.length, 0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Students Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Student ID</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Average Grade</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {getInitials(student.firstName, student.lastName)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {student.firstName} {student.lastName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {student.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.courseName}</TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={student.status}
                        onChange={(e) => handleUpdateStudentStatus(student._id, e.target.value as Student['status'])}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="dropped">Dropped</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Chip 
                        label={`${student.averageGrade}%`}
                        color={getGradeColor(student.averageGrade) as any}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Rating 
                        value={student.averageGrade / 20} 
                        readOnly 
                        size="small"
                        precision={0.1}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {student.attendance}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenGradeDialog(student)}
                      color="primary"
                      title="Add Grade"
                    >
                      <Grade />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="info"
                      title="View Details"
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Grade Dialog */}
        <Dialog open={openGradeDialog} onClose={handleCloseGradeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Add Grade for {selectedStudent?.firstName} {selectedStudent?.lastName}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Assignment Name"
                value={gradeData.assignmentName}
                onChange={handleInputChange('assignmentName')}
                fullWidth
                required
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Score"
                    type="number"
                    value={gradeData.score}
                    onChange={handleInputChange('score')}
                    fullWidth
                    required
                    inputProps={{ min: 0, max: gradeData.maxScore }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Max Score"
                    type="number"
                    value={gradeData.maxScore}
                    onChange={handleInputChange('maxScore')}
                    fullWidth
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              </Grid>
              <Typography variant="body2" color="textSecondary">
                Percentage: {gradeData.maxScore > 0 ? Math.round((gradeData.score / gradeData.maxScore) * 100) : 0}%
              </Typography>
              <TextField
                label="Feedback (Optional)"
                value={gradeData.feedback}
                onChange={handleInputChange('feedback')}
                fullWidth
                multiline
                rows={3}
                placeholder="Provide feedback for the student..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseGradeDialog}>Cancel</Button>
            <Button 
              onClick={handleAddGrade} 
              variant="contained"
              disabled={saving || !gradeData.assignmentName || gradeData.maxScore <= 0}
            >
              {saving ? <CircularProgress size={20} /> : 'Add Grade'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default StudentManagement;