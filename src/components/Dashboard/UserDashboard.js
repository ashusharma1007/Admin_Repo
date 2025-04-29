import React from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const notifications = [
  { id: 1, message: 'Your profile was updated successfully', date: '2023-10-15' },
  { id: 2, message: 'New feature: Dark mode is now available', date: '2023-10-14' },
  { id: 3, message: 'Your account password was changed', date: '2023-10-10' },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        User Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3, 
              background: 'linear-gradient(to right, #2563eb, #7c3aed)',
              color: 'white'
            }}
          >
            <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
              Welcome back, User!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              Here's what's happening with your account today.
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              View Profile
            </Button>
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <List>
              <ListItem button onClick={() => navigate('/profile')}>
                <ListItemIcon>
                  <AccountCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Edit Profile" />
              </ListItem>
              <Divider component="li" />
              <ListItem button onClick={() => navigate('/settings')}>
                <ListItemIcon>
                  <SettingsIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
              <Divider component="li" />
              <ListItem button>
                <ListItemIcon>
                  <LockIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Change Password" />
              </ListItem>
              <Divider component="li" />
              <ListItem button>
                <ListItemIcon>
                  <HelpIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Help & Support" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Notifications */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Notifications
              </Typography>
              <Button variant="text" endIcon={<NotificationsIcon />}>
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={notification.message}
                      secondary={notification.date}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Feature Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                Your Documents
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Access and manage your uploaded documents and files.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">View Documents</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                Messages
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Check your inbox for new messages and notifications.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">View Messages</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                Account Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Update your preferences and security settings.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Update Settings</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;