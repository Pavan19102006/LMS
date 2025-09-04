import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Schedule,
  CheckCircle,
  Pending,
  Warning,
  Upload,
  AttachFile,
  Delete,
  CloudUpload,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axios';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: {
    _id: string;
    title: string;
  };
  dueDate: string;
  maxPoints: number;
  type: string;
  submissions: any[];
  isOverdue: boolean;
}

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/assignments');
      setAssignments(response.data.assignments || []);
    } catch (err: any) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    const userSubmission = assignment.submissions?.find(
      (sub: any) => sub.student === user?.id
    );
    
    if (userSubmission) {
      if (userSubmission.grade) return 'graded';
      return 'submitted';
    }
    
    if (new Date(assignment.dueDate) < new Date()) {
      return 'overdue';
    }
    
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'success';
      case 'submitted': return 'info';
      case 'overdue': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded': return <CheckCircle />;
      case 'submitted': return <Pending />;
      case 'overdue': return <Warning />;
      case 'pending': return <Schedule />;
      default: return <AssignmentIcon />;
    }
  };

  const filterAssignments = (assignments: Assignment[], tabIndex: number) => {
    switch (tabIndex) {
      case 0: return assignments; 
      case 1: return assignments.filter(a => getAssignmentStatus(a) === 'pending'); 
      case 2: return assignments.filter(a => getAssignmentStatus(a) === 'submitted'); 
      case 3: return assignments.filter(a => getAssignmentStatus(a) === 'graded'); 
      default: return assignments;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionText('');
    setSelectedFiles([]);
    setSubmitDialogOpen(true);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return;

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('text', submissionText);
      
      
      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });

      
      await axios.post(
        `/api/assignments/${selectedAssignment._id}/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      
      await fetchAssignments();
      
      setSubmitDialogOpen(false);
      setSelectedAssignment(null);
      setSubmissionText('');
      setSelectedFiles([]);
      
      
      alert('Assignment submitted successfully!');
      
    } catch (err: any) {
      console.error('Error submitting assignment:', err);
      alert(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredAssignments = filterAssignments(assignments, activeTab);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <AssignmentIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          My Assignments
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            <Tab label={`All (${assignments.length})`} />
            <Tab 
              label={`Pending (${filterAssignments(assignments, 1).length})`} 
              sx={{ color: 'orange' }}
            />
            <Tab 
              label={`Submitted (${filterAssignments(assignments, 2).length})`} 
              sx={{ color: 'blue' }}
            />
            <Tab 
              label={`Graded (${filterAssignments(assignments, 3).length})`} 
              sx={{ color: 'green' }}
            />
          </Tabs>
        </Paper>

        {}
        {filteredAssignments.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No assignments found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {activeTab === 0 
                ? "You don't have any assignments yet. Check back later or contact your instructor."
                : `No ${['', 'pending', 'submitted', 'graded'][activeTab]} assignments at this time.`
              }
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredAssignments.map((assignment) => {
              const status = getAssignmentStatus(assignment);
              const userSubmission = assignment.submissions?.find(
                (sub: any) => sub.student === user?.id
              );

              return (
                <Grid item xs={12} key={assignment._id}>
                  <Card sx={{ '&:hover': { boxShadow: 3 } }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {assignment.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Course: {assignment.course.title}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {assignment.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Chip
                              icon={getStatusIcon(status)}
                              label={status.charAt(0).toUpperCase() + status.slice(1)}
                              color={getStatusColor(status) as any}
                              size="small"
                            />
                            <Chip
                              label={assignment.type}
                              variant="outlined"
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary">
                              Due: {formatDate(assignment.dueDate)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Max Points: {assignment.maxPoints}
                            </Typography>
                          </Box>

                          {userSubmission && userSubmission.grade && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                              <Typography variant="body2" color="success.dark">
                                <strong>Grade: {userSubmission.grade.points}/{assignment.maxPoints}</strong>
                              </Typography>
                              {userSubmission.grade.feedback && (
                                <Typography variant="body2" color="success.dark" sx={{ mt: 1 }}>
                                  Feedback: {userSubmission.grade.feedback}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ ml: 2 }}>
                          {status === 'pending' && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<Upload />}
                              onClick={() => handleSubmitClick(assignment)}
                            >
                              Submit
                            </Button>
                          )}
                          {status === 'submitted' && (
                            <Button
                              variant="outlined"
                              color="info"
                              size="small"
                              disabled
                            >
                              Submitted
                            </Button>
                          )}
                          {status === 'graded' && (
                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              onClick={() => {
                                
                                console.log('View grade for assignment:', assignment._id);
                              }}
                            >
                              View Grade
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {}
        <Dialog 
          open={submitDialogOpen} 
          onClose={() => setSubmitDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AssignmentIcon sx={{ mr: 1 }} />
              Submit Assignment: {selectedAssignment?.title}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {}
              <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Course:</strong> {selectedAssignment?.course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Due Date:</strong> {selectedAssignment && formatDate(selectedAssignment.dueDate)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Max Points:</strong> {selectedAssignment?.maxPoints}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Type:</strong> {selectedAssignment?.type}
                </Typography>
              </Paper>

              {}
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Assignment Text (Optional)"
                placeholder="Enter your assignment text, notes, or explanations here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                sx={{ mb: 3 }}
              />

              {}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachFile sx={{ mr: 1 }} />
                  File Attachments
                </Typography>
                
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={handleFileSelect}
                  sx={{ mb: 2 }}
                >
                  Select Files to Upload
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                />

                {}
                {selectedFiles.length > 0 && (
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Selected Files ({selectedFiles.length}):
                    </Typography>
                    <List dense>
                      {selectedFiles.map((file, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={file.name}
                            secondary={formatFileSize(file.size)}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <Delete />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Box>

              {}
              {uploading && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Uploading assignment...
                  </Typography>
                  <LinearProgress />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setSubmitDialogOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitAssignment}
              disabled={uploading || (submissionText.trim() === '' && selectedFiles.length === 0)}
              startIcon={uploading ? <CircularProgress size={16} /> : <Upload />}
            >
              {uploading ? 'Submitting...' : 'Submit Assignment'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Assignments;
