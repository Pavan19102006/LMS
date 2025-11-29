import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Typography,
  Box,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Grid,
  Avatar,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Pending,
  Download,
  Assessment
} from '@mui/icons-material';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

interface Submission {
  _id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  submittedAt: string;
  content: {
    text?: string;
    answers?: any[];
    attachments?: Array<{
      filename: string;
      url: string;
    }>;
  };
  grade?: number;
  feedback?: string;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: {
    _id: string;
    title: string;
  };
  maxPoints: number;
  type: string;
  dueDate: string;
  quizQuestions?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

interface GradeSubmissionsProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const GradeSubmissions: React.FC<GradeSubmissionsProps> = ({ open, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState('');
  const [grades, setGrades] = useState<{ [key: string]: { grade: number; feedback: string } }>({});

  useEffect(() => {
    if (open) {
      fetchAssignments();
    }
  }, [open]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all assignments for instructor
      const response = await axios.get('/api/assignments');
      const allAssignments = response.data.assignments || [];
      
      // Filter assignments that have submissions
      const assignmentsWithSubmissions = allAssignments.filter(
        (a: Assignment) => a.type === 'quiz' || a.type === 'project'
      );
      
      setAssignments(assignmentsWithSubmissions);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      setError(error.response?.data?.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId: string) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`/api/assignments/${assignmentId}/submissions`);
      const fetchedSubmissions = response.data.submissions || [];
      setSubmissions(fetchedSubmissions);
      
      // Initialize grades state
      const initialGrades: { [key: string]: { grade: number; feedback: string } } = {};
      fetchedSubmissions.forEach((sub: Submission) => {
        initialGrades[sub._id] = {
          grade: sub.grade || 0,
          feedback: sub.feedback || ''
        };
      });
      setGrades(initialGrades);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      setError(error.response?.data?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    fetchSubmissions(assignment._id);
  };

  const handleGradeChange = (submissionId: string, grade: string) => {
    const numGrade = parseFloat(grade) || 0;
    const maxPoints = selectedAssignment?.maxPoints || 100;
    
    setGrades(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        grade: Math.min(numGrade, maxPoints)
      }
    }));
  };

  const handleFeedbackChange = (submissionId: string, feedback: string) => {
    setGrades(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        feedback
      }
    }));
  };

  const handleSubmitGrade = async (submissionId: string) => {
    try {
      setGrading(true);
      setError('');
      
      const gradeData = grades[submissionId];
      
      await axios.put(`/api/assignments/${selectedAssignment?._id}/submissions/${submissionId}/grade`, {
        grade: gradeData.grade,
        feedback: gradeData.feedback
      });
      
      // Refresh submissions
      if (selectedAssignment) {
        await fetchSubmissions(selectedAssignment._id);
      }
      
      alert('Grade submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting grade:', error);
      setError(error.response?.data?.message || 'Failed to submit grade');
    } finally {
      setGrading(false);
    }
  };

  const calculateQuizScore = (submission: Submission) => {
    if (!selectedAssignment?.quizQuestions || !submission.content.answers) {
      return 0;
    }
    
    let correctAnswers = 0;
    submission.content.answers.forEach((answer, index) => {
      if (answer === selectedAssignment.quizQuestions![index].correctAnswer) {
        correctAnswers++;
      }
    });
    
    const totalQuestions = selectedAssignment.quizQuestions.length;
    const score = (correctAnswers / totalQuestions) * (selectedAssignment.maxPoints || 100);
    return Math.round(score * 10) / 10;
  };

  const handleClose = () => {
    setSelectedAssignment(null);
    setSubmissions([]);
    setGrades({});
    setError('');
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Grade Assignments
        {selectedAssignment && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {selectedAssignment.title} - {selectedAssignment.course.title}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && !selectedAssignment ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : !selectedAssignment ? (
          <>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Select an assignment to view and grade submissions
            </Typography>
            <List>
              {assignments.length === 0 ? (
                <Alert severity="info">
                  No assignments found. Create an assignment first.
                </Alert>
              ) : (
                assignments.map((assignment) => (
                  <ListItem
                    key={assignment._id}
                    button
                    onClick={() => handleSelectAssignment(assignment)}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <Box width="100%">
                      <Typography variant="h6">{assignment.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {assignment.course.title} • {assignment.type.toUpperCase()} • Max Points: {assignment.maxPoints}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Due: {formatDate(assignment.dueDate)}
                      </Typography>
                    </Box>
                  </ListItem>
                ))
              )}
            </List>
          </>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSelectedAssignment(null);
                  setSubmissions([]);
                }}
              >
                ← Back to Assignments
              </Button>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
              </Box>
            ) : submissions.length === 0 ? (
              <Alert severity="info">
                No submissions yet for this assignment.
              </Alert>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Submissions ({submissions.length})
                </Typography>
                {submissions.map((submission) => {
                  const autoScore = selectedAssignment.type === 'quiz' ? calculateQuizScore(submission) : null;
                  const isGraded = submission.grade !== undefined && submission.grade !== null;
                  
                  return (
                    <Accordion key={submission._id} sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box display="flex" alignItems="center" width="100%">
                          <Avatar sx={{ mr: 2 }}>
                            {submission.student.firstName[0]}{submission.student.lastName[0]}
                          </Avatar>
                          <Box flexGrow={1}>
                            <Typography variant="subtitle1">
                              {submission.student.firstName} {submission.student.lastName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Submitted: {formatDate(submission.submittedAt)}
                            </Typography>
                          </Box>
                          <Chip
                            icon={isGraded ? <CheckCircle /> : <Pending />}
                            label={isGraded ? `Graded: ${submission.grade}/${selectedAssignment.maxPoints}` : 'Pending'}
                            color={isGraded ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Divider sx={{ mb: 2 }} />
                            
                            {/* Quiz Answers */}
                            {selectedAssignment.type === 'quiz' && submission.content.answers && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Quiz Answers
                                </Typography>
                                {selectedAssignment.quizQuestions?.map((question, index) => {
                                  const studentAnswer = submission.content.answers![index];
                                  const isCorrect = studentAnswer === question.correctAnswer;
                                  
                                  return (
                                    <Paper key={index} sx={{ p: 2, mb: 1, backgroundColor: isCorrect ? 'success.light' : 'error.light' }}>
                                      <Typography variant="body2" fontWeight="bold">
                                        Q{index + 1}: {question.question}
                                      </Typography>
                                      <Typography variant="body2" sx={{ mt: 1 }}>
                                        Student Answer: {question.options[studentAnswer]}
                                        {isCorrect ? ' ✓' : ' ✗'}
                                      </Typography>
                                      {!isCorrect && (
                                        <Typography variant="body2" color="success.dark">
                                          Correct Answer: {question.options[question.correctAnswer]}
                                        </Typography>
                                      )}
                                    </Paper>
                                  );
                                })}
                                {autoScore !== null && (
                                  <Alert severity="info" sx={{ mt: 2 }}>
                                    Auto-calculated Score: {autoScore}/{selectedAssignment.maxPoints}
                                  </Alert>
                                )}
                              </Box>
                            )}
                            
                            {/* Text Submission */}
                            {submission.content.text && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Submission Text
                                </Typography>
                                <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                                  <Typography variant="body2">{submission.content.text}</Typography>
                                </Paper>
                              </Box>
                            )}
                            
                            {/* Attachments */}
                            {submission.content.attachments && submission.content.attachments.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Attachments
                                </Typography>
                                {submission.content.attachments.map((attachment, index) => (
                                  <Chip
                                    key={index}
                                    label={attachment.filename}
                                    icon={<Download />}
                                    onClick={() => window.open(attachment.url, '_blank')}
                                    sx={{ mr: 1, mb: 1 }}
                                  />
                                ))}
                              </Box>
                            )}
                          </Grid>
                          
                          {/* Grading Section */}
                          <Grid item xs={12}>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle2" gutterBottom>
                              Grade Submission
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  fullWidth
                                  label={`Grade (Max: ${selectedAssignment.maxPoints})`}
                                  type="number"
                                  value={grades[submission._id]?.grade || (autoScore !== null ? autoScore : 0)}
                                  onChange={(e) => handleGradeChange(submission._id, e.target.value)}
                                  inputProps={{ 
                                    min: 0, 
                                    max: selectedAssignment.maxPoints,
                                    step: 0.5
                                  }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={8}>
                                <TextField
                                  fullWidth
                                  label="Feedback (Optional)"
                                  multiline
                                  rows={2}
                                  value={grades[submission._id]?.feedback || ''}
                                  onChange={(e) => handleFeedbackChange(submission._id, e.target.value)}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  startIcon={<Assessment />}
                                  onClick={() => handleSubmitGrade(submission._id)}
                                  disabled={grading}
                                >
                                  {grading ? <CircularProgress size={24} /> : 'Submit Grade'}
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GradeSubmissions;
