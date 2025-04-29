import React from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminPanelIcon,
  PersonAdd as PersonAddIcon,
  History as HistoryIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import StatsCard from '../UI/StatsCard';
import ActionCard from '../UI/ActionCard';
import { dashboardStats, recentActivity } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', users: 4 },
  { name: 'Feb', users: 7 },
  { name: 'Mar', users: 12 },
  { name: 'Apr', users: 15 },
  { name: 'May', users: 18 },
  { name: 'Jun', users: 24 },
  { name: 'Jul', users: 31 },
  { name: 'Aug', users: 35 },
  { name: 'Sep', users: 38 },
  { name: 'Oct', users: 42 },
];

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Super Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Total Users" 
            value={dashboardStats.totalUsers} 
            icon={<PeopleIcon />} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Total Admins" 
            value={dashboardStats.totalAdmins} 
            icon={<AdminPanelIcon />} 
            color="secondary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="New Users Today" 
            value={dashboardStats.newUsersToday} 
            icon={<PersonAddIcon />} 
            color="success" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Recent Logins" 
            value={dashboardStats.recentLoginCount} 
            icon={<HistoryIcon />} 
            color="warning" 
          />
        </Grid>
        
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              User Growth
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Activity
            </Typography>
            <List sx={{ width: '100%' }}>
              {recentActivity.slice(0, 4).map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <AccessTimeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.action}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {activity.user}
                          </Typography>
                          {` — ${activity.timestamp}`}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Action Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <ActionCard
            title="User Management"
            description="Add, edit, or remove user accounts. Manage permissions and access levels."
            action="Manage Users"
            onClick={() => navigate('/users')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <ActionCard
            title="Admin Management"
            description="Manage administrator accounts and privileges. Create new admin accounts."
            action="Manage Admins"
            onClick={() => navigate('/admins')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <ActionCard
            title="View Audit Logs"
            description="Review system activity and changes. Monitor who made changes and when."
            action="View Logs"
            onClick={() => navigate('/audit')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperAdminDashboard;
