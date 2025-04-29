import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const ActionCard = ({ title, description, action, onClick }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Button 
            variant="text" 
            color="primary" 
            onClick={onClick}
            endIcon={<ArrowForwardIcon />}
          >
            {action}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActionCard;