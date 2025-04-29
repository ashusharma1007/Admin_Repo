import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}.light`,
              width: 56,
              height: 56,
              '& svg': {
                color: `${color}.main`,
              },
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;