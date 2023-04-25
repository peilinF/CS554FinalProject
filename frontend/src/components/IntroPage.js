import React from 'react';
import { Typography } from '@mui/material';

const IntroPage = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to My App
      </Typography>
      <Typography variant="body1">
        This is a simple app that can track and share user locations.
      </Typography>
    </div>
  );
};

export default IntroPage;
