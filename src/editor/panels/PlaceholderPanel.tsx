import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface PlaceholderPanelProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <Box
      sx={{
        height: '100%',
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 400,
          bgcolor: 'transparent',
        }}
      >
        {icon && (
          <Box sx={{ mb: 2, opacity: 0.5 }}>
            {icon}
          </Box>
        )}
        <Typography variant="h6" gutterBottom color="text.secondary">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default PlaceholderPanel;
