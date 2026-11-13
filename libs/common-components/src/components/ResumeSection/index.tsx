import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme as useEmotionTheme } from '@emotion/react';

const ResumeSection: React.FC = () => {
  const theme = useTheme();
  const emotionTheme = useEmotionTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, backgroundColor: emotionTheme.palette.background.default, color: emotionTheme.palette.text.primary }}>
      <Typography variant='h4' gutterBottom>
        RRR's Resume
      </Typography>
      <Typography variant='body1' gutterBottom>
        Software Developer
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: emotionTheme.palette.background.paper, padding: 1, borderRadius: 1, boxShadow: 2, flex: 1 }}>
          <Typography variant='body2' gutterBottom>
            Skills
          </Typography>
          <ul>
            <li>JavaScript</li>
            <li>TypeScript</li>
            <li>React</li>
            <li>Node.js</li>
            <li>Python</li>
          </ul>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: emotionTheme.palette.background.paper, padding: 1, borderRadius: 1, boxShadow: 2, flex: 1 }}>
          <Typography variant='body2' gutterBottom>
            Experience
          </Typography>
          <ul>
            <li>Software Developer at ABC Corp</li>
            <li>Full Stack Developer at DEF Corp</li>
          </ul>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant='body2' gutterBottom>
          Contact
        </Typography>
        <ul>
          <li>Email: person@example.com</li>
          <li>Phone: 123-456-7890</li>
        </ul>
      </Box>
    </Box>
  );
};

export default ResumeSection;