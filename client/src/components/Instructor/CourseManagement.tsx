import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const CourseManagement: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Course Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your courses, create new content, and track student progress.
        </Typography>
      </Box>
    </Container>
  );
};

export default CourseManagement;