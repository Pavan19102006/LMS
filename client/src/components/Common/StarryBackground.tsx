import React from 'react';
import { Box } from '@mui/material';

const StarryBackground: React.FC = () => {
  return (
    <>
      {}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
          zIndex: -2,
        }}
      />
      
      {}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, #FFD700 1px, transparent 1px),
            radial-gradient(circle at 85% 15%, #C9B037 0.8px, transparent 0.8px),
            radial-gradient(circle at 25% 85%, #FFD700 1.2px, transparent 1.2px),
            radial-gradient(circle at 75% 75%, #F4D03F 0.6px, transparent 0.6px),
            radial-gradient(circle at 45% 35%, #C9B037 0.9px, transparent 0.9px),
            radial-gradient(circle at 95% 65%, #FFD700 0.7px, transparent 0.7px),
            radial-gradient(circle at 5% 55%, #F4D03F 1px, transparent 1px),
            radial-gradient(circle at 65% 5%, #C9B037 0.8px, transparent 0.8px),
            radial-gradient(circle at 35% 95%, #FFD700 1.1px, transparent 1.1px),
            radial-gradient(circle at 55% 45%, #F4D03F 0.6px, transparent 0.6px),
            radial-gradient(circle at 20% 60%, #FFD700 0.7px, transparent 0.7px),
            radial-gradient(circle at 80% 40%, #C9B037 0.9px, transparent 0.9px),
            radial-gradient(circle at 10% 15%, #F4D03F 0.8px, transparent 0.8px),
            radial-gradient(circle at 90% 80%, #FFD700 0.6px, transparent 0.6px),
            radial-gradient(circle at 40% 10%, #C9B037 1px, transparent 1px),
            radial-gradient(circle at 60% 90%, #F4D03F 0.7px, transparent 0.7px),
            radial-gradient(circle at 30% 50%, #FFD700 0.5px, transparent 0.5px),
            radial-gradient(circle at 70% 50%, #C9B037 0.8px, transparent 0.8px)
          `,
          opacity: 0.6,
          zIndex: -1,
        }}
      />

      {}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 30% 10%, #F4D03F 0.5px, transparent 0.5px),
            radial-gradient(circle at 70% 30%, #FFD700 0.8px, transparent 0.8px),
            radial-gradient(circle at 10% 80%, #C9B037 0.6px, transparent 0.6px),
            radial-gradient(circle at 90% 90%, #F4D03F 0.7px, transparent 0.7px),
            radial-gradient(circle at 40% 70%, #FFD700 0.5px, transparent 0.5px),
            radial-gradient(circle at 60% 20%, #C9B037 0.9px, transparent 0.9px),
            radial-gradient(circle at 12% 45%, #F4D03F 0.6px, transparent 0.6px),
            radial-gradient(circle at 88% 55%, #FFD700 0.7px, transparent 0.7px),
            radial-gradient(circle at 22% 75%, #C9B037 0.5px, transparent 0.5px),
            radial-gradient(circle at 78% 25%, #F4D03F 0.8px, transparent 0.8px),
            radial-gradient(circle at 50% 5%, #FFD700 0.6px, transparent 0.6px),
            radial-gradient(circle at 50% 95%, #C9B037 0.7px, transparent 0.7px),
            radial-gradient(circle at 5% 25%, #F4D03F 0.5px, transparent 0.5px),
            radial-gradient(circle at 95% 75%, #FFD700 0.9px, transparent 0.9px)
          `,
          opacity: 0.4,
          zIndex: -1,
        }}
      />

      {}
      <Box
        className="falling-stars"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <Box className="falling-star" />
        <Box className="falling-star" />
        <Box className="falling-star" />
        <Box className="falling-star" />
        <Box className="falling-star" />
        <Box className="falling-star" />
        <Box className="falling-star" />
        <Box className="falling-star" />
      </Box>
    </>
  );
};

export default StarryBackground;
