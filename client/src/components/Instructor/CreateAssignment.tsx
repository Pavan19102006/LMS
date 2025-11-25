import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Grid,
  Chip,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

interface Course {
  _id: string;
  title: string;
  category: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface CreateAssignmentProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAssignment: React.FC<CreateAssignmentProps> = ({ open, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [selectedCourse, setSelectedCourse] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'quiz' | 'submission'>('quiz');
  const [dueDate, setDueDate] = useState('');
  const [maxPoints, setMaxPoints] = useState(100);
  const [instructions, setInstructions] = useState('');
  
  // Quiz specific
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Submission specific
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const steps = ['Select Course', 'Assignment Details', type === 'quiz' ? 'Create Questions' : 'Upload Materials'];

  useEffect(() => {
    if (open) {
      fetchCourses();
    }
  }, [open]);

  useEffect(() => {
    if (type === 'quiz' && numberOfQuestions > 0) {
      const newQuestions: Question[] = [];
      for (let i = 0; i < numberOfQuestions; i++) {
        newQuestions.push({
          id: i + 1,
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        });
      }
      setQuestions(newQuestions);
    }
  }, [numberOfQuestions, type]);

  const fetchCourses = async () => {
    try {
      let response;
      
      console.log('🔍 Fetching courses for user:', user);
      console.log('📌 User ID:', user?.id);
      console.log('📌 User Role:', user?.role);
      
      if (user?.role === 'instructor') {
        // Fetch courses taught by this instructor
        const userId = user.id;
        console.log('🌐 Making request to:', `/api/courses/instructor/${userId}`);
        response = await axios.get(`/api/courses/instructor/${userId}`);
        console.log('✅ API Response:', response.data);
        const coursesData = response.data.courses || response.data || [];
        console.log('📚 Courses array:', coursesData, 'Length:', coursesData.length);
        setCourses(coursesData);
      } else if (user?.role === 'admin') {
        // Admin can see all courses
        response = await axios.get('/api/courses', {
          params: { 
            published: 'false',
            limit: 100
          }
        });
        setCourses(response.data.courses || []);
        console.log('Admin courses fetched:', response.data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedCourse) {
      setError('Please select a course');
      return;
    }
    if (activeStep === 1) {
      if (!title || !description || !dueDate || !instructions) {
        setError('Please fill in all required fields');
        return;
      }
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    if (field === 'question') {
      updatedQuestions[index].question = value;
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.replace('option', ''));
      updatedQuestions[index].options[optionIndex] = value;
    } else if (field === 'correctAnswer') {
      updatedQuestions[index].correctAnswer = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachmentFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const assignmentData: any = {
        title,
        description,
        course: selectedCourse,
        type: type === 'quiz' ? 'quiz' : 'project',
        maxPoints,
        dueDate: new Date(dueDate).toISOString(),
        instructions,
        isPublished: true
      };

      // Add quiz questions or attachment info
      if (type === 'quiz') {
        // Remove the id field from questions as MongoDB will auto-generate _id
        assignmentData.quizQuestions = questions.map(({ id, ...rest }) => rest);
      } else if (attachmentFile) {
        // For now, just store filename. In production, upload to cloud storage
        assignmentData.attachments = [{
          filename: attachmentFile.name,
          url: attachmentUrl || 'pending-upload',
          fileType: attachmentFile.type
        }];
      }

      const response = await axios.post('/api/assignments', assignmentData);
      
      console.log('Assignment created:', response.data);
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      setError(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelectedCourse('');
    setTitle('');
    setDescription('');
    setType('quiz');
    setDueDate('');
    setMaxPoints(100);
    setInstructions('');
    setNumberOfQuestions(5);
    setQuestions([]);
    setAttachmentFile(null);
    setAttachmentUrl('');
    setError('');
    onClose();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select Course</InputLabel>
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                label="Select Course"
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.title} - {course.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {courses.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No courses available. Create a course first to add assignments.
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Assignment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              multiline
              rows={3}
              required
            />
            
            <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
              <FormLabel component="legend">Assignment Type</FormLabel>
              <RadioGroup
                row
                value={type}
                onChange={(e) => setType(e.target.value as 'quiz' | 'submission')}
              >
                <FormControlLabel value="quiz" control={<Radio />} label="Quiz" />
                <FormControlLabel value="submission" control={<Radio />} label="Submission" />
              </RadioGroup>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Points"
                  type="number"
                  value={maxPoints}
                  onChange={(e) => setMaxPoints(parseInt(e.target.value))}
                  inputProps={{ min: 1 }}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              margin="normal"
              multiline
              rows={4}
              required
            />

            {type === 'quiz' && (
              <TextField
                fullWidth
                label="Number of Questions"
                type="number"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                margin="normal"
                inputProps={{ min: 1, max: 50 }}
              />
            )}
          </Box>
        );

      case 2:
        if (type === 'quiz') {
          return (
            <Box sx={{ mt: 2, maxHeight: '500px', overflowY: 'auto' }}>
              {questions.map((q, index) => (
                <Card key={q.id} sx={{ mb: 3, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Question {index + 1}
                  </Typography>
                  <TextField
                    fullWidth
                    label="Question"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    margin="normal"
                    required
                  />
                  
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Options:
                  </Typography>
                  {q.options.map((option, optIndex) => (
                    <TextField
                      key={optIndex}
                      fullWidth
                      label={`Option ${optIndex + 1}`}
                      value={option}
                      onChange={(e) => handleQuestionChange(index, `option${optIndex}`, e.target.value)}
                      margin="dense"
                      required
                    />
                  ))}

                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Correct Answer</InputLabel>
                    <Select
                      value={q.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                      label="Correct Answer"
                    >
                      {q.options.map((_, optIndex) => (
                        <MenuItem key={optIndex} value={optIndex}>
                          Option {optIndex + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Card>
              ))}
            </Box>
          );
        } else {
          return (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upload Assignment Materials
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload any documents, files, or materials related to this assignment.
              </Typography>

              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.zip"
                />
                <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1">
                  {attachmentFile ? attachmentFile.name : 'Click to upload file'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF, DOC, DOCX, TXT, ZIP (Max 10MB)
                </Typography>
              </Box>

              {attachmentFile && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={attachmentFile.name}
                    onDelete={() => setAttachmentFile(null)}
                    color="primary"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {(attachmentFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
              )}

              <TextField
                fullWidth
                label="Or enter file URL (optional)"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                margin="normal"
                placeholder="https://example.com/file.pdf"
              />
            </Box>
          );
        }

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Create Assignment</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>Back</Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Assignment'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateAssignment;
