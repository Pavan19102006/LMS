import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const InstructorAnalytics: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View detailed analytics about your courses and student performance.
        </Typography>
      </Box>
    </Container>
  );
};

export default InstructorAnalytics;