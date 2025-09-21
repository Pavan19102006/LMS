import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp,
  People,
  School,
  Assignment,
  Grade,
  Refresh,
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axios';

interface AnalyticsData {
  studentEngagement: Array<{
    week: string;
    attendance: number;
    submissions: number;
    averageGrade: number;
  }>;
  gradeDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  coursePerformance: Array<{
    courseCode: string;
    courseName: string;
    enrolledStudents: number;
    averageGrade: number;
    completionRate: number;
  }>;
  assignmentStats: Array<{
    assignment: string;
    averageScore: number;
    submissionRate: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const InstructorAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('semester');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`/api/analytics/instructor?period=${selectedPeriod}`);
      setAnalytics(response.data);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics. Showing demo data.');
      
      // Demo data
      setAnalytics({
        studentEngagement: [
          { week: 'Week 1', attendance: 95, submissions: 28, averageGrade: 85 },
          { week: 'Week 2', attendance: 92, submissions: 26, averageGrade: 87 },
          { week: 'Week 3', attendance: 88, submissions: 29, averageGrade: 83 },
          { week: 'Week 4', attendance: 90, submissions: 27, averageGrade: 89 },
          { week: 'Week 5', attendance: 85, submissions: 25, averageGrade: 86 },
          { week: 'Week 6', attendance: 93, submissions: 30, averageGrade: 91 },
        ],
        gradeDistribution: [
          { range: 'A (90-100)', count: 12, percentage: 40 },
          { range: 'B (80-89)', count: 10, percentage: 33 },
          { range: 'C (70-79)', count: 6, percentage: 20 },
          { range: 'D (60-69)', count: 2, percentage: 7 },
          { range: 'F (0-59)', count: 0, percentage: 0 },
        ],
        coursePerformance: [
          { 
            courseCode: 'CS101', 
            courseName: 'Introduction to React', 
            enrolledStudents: 25, 
            averageGrade: 86.5, 
            completionRate: 96 
          },
          { 
            courseCode: 'CS201', 
            courseName: 'Advanced JavaScript', 
            enrolledStudents: 20, 
            averageGrade: 82.3, 
            completionRate: 85 
          },
          { 
            courseCode: 'CS301', 
            courseName: 'Full Stack Development', 
            enrolledStudents: 18, 
            averageGrade: 88.7, 
            completionRate: 100 
          },
        ],
        assignmentStats: [
          { assignment: 'React Basics', averageScore: 88, submissionRate: 96, difficulty: 'Easy' },
          { assignment: 'State Management', averageScore: 82, submissionRate: 92, difficulty: 'Medium' },
          { assignment: 'API Integration', averageScore: 75, submissionRate: 88, difficulty: 'Hard' },
          { assignment: 'Final Project', averageScore: 91, submissionRate: 100, difficulty: 'Hard' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  const getPerformanceColor = (grade: number) => {
    if (grade >= 90) return 'success';
    if (grade >= 80) return 'info';
    if (grade >= 70) return 'warning';
    return 'error';
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

  if (!analytics) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Failed to load analytics data</Alert>
        </Box>
      </Container>
    );
  }

  const totalStudents = analytics.coursePerformance.reduce((sum, course) => sum + course.enrolledStudents, 0);
  const overallAverage = analytics.coursePerformance.reduce((sum, course) => sum + course.averageGrade, 0) / analytics.coursePerformance.length;
  const totalAssignments = analytics.assignmentStats.length;
  const averageSubmissionRate = analytics.assignmentStats.reduce((sum, assignment) => sum + assignment.submissionRate, 0) / analytics.assignmentStats.length;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Analytics Dashboard
          </Typography>
          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                label="Period"
              >
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="semester">This Semester</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchAnalytics}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <People color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Students
                    </Typography>
                    <Typography variant="h4">{totalStudents}</Typography>
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
                      Overall Average
                    </Typography>
                    <Typography variant="h4">{Math.round(overallAverage)}%</Typography>
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
                      Total Assignments
                    </Typography>
                    <Typography variant="h4">{totalAssignments}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUp color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Avg Submission Rate
                    </Typography>
                    <Typography variant="h4">{Math.round(averageSubmissionRate)}%</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Student Engagement Trend */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Student Engagement Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.studentEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="attendance" stroke="#8884d8" name="Attendance %" />
                    <Line type="monotone" dataKey="submissions" stroke="#82ca9d" name="Submissions" />
                    <Line type="monotone" dataKey="averageGrade" stroke="#ffc658" name="Average Grade %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Grade Distribution */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Grade Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percentage }) => `${range}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Course Performance */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course Performance Overview
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Code</TableCell>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Enrolled Students</TableCell>
                        <TableCell>Average Grade</TableCell>
                        <TableCell>Completion Rate</TableCell>
                        <TableCell>Performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analytics.coursePerformance.map((course) => (
                        <TableRow key={course.courseCode}>
                          <TableCell>{course.courseCode}</TableCell>
                          <TableCell>{course.courseName}</TableCell>
                          <TableCell>{course.enrolledStudents}</TableCell>
                          <TableCell>{course.averageGrade.toFixed(1)}%</TableCell>
                          <TableCell>{course.completionRate}%</TableCell>
                          <TableCell>
                            <Chip 
                              label={course.averageGrade >= 85 ? 'Excellent' : course.averageGrade >= 75 ? 'Good' : 'Needs Improvement'}
                              color={getPerformanceColor(course.averageGrade) as any}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Assignment Performance */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Assignment Performance Analysis
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.assignmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="assignment" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageScore" fill="#8884d8" name="Average Score %" />
                    <Bar dataKey="submissionRate" fill="#82ca9d" name="Submission Rate %" />
                  </BarChart>
                </ResponsiveContainer>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Assignment Difficulty Breakdown:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {analytics.assignmentStats.map((assignment, index) => (
                      <Chip
                        key={index}
                        label={`${assignment.assignment} (${assignment.difficulty})`}
                        color={getDifficultyColor(assignment.difficulty) as any}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default InstructorAnalytics;