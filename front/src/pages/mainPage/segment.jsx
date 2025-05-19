import React from 'react';
import { Box, Typography } from '@mui/material';

function Segment({ label, icon }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Typography variant="h6">{label}</Typography>
      {icon && <Typography variant="h6">{icon}</Typography>}
    </Box>
  );
}

export default Segment;