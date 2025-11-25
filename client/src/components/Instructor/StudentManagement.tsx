import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const StudentManagement: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Student Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage enrolled students, track their progress, and provide feedback.
        </Typography>
      </Box>
    </Container>
  );
};

export default StudentManagement;