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
  Avatar,
  Button
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  History as HistoryIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import StatsCard from '../UI/StatsCard';
import ActionCard from '../UI/ActionCard';
import { dashboardStats, recentActivity } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', active: 4, total: 4 },
  { name: 'Feb', active: 6, total: 7 },
  { name: 'Mar', active: 10, total: 12 },
  { name: 'Apr', active: 12, total: 15 },
  { name: 'May', active: 15, total: 18 },
  { name: 'Jun', active: 20, total: 24 },
  { name: 'Jul', active: 28, total: 31 },
  { name: 'Aug', active: 31, total: 35 },
  { name: 'Sep', active: 35, total: 38 },
  { name: 'Oct', active: 38, total: 42 },
];

const pendingApprovals = [
  { id: 1, name: 'John Smith', email: 'john@example.com', role: 'user', requestedAt: '2023-10-12' },
  { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', role: 'user', requestedAt: '2023-10-14' },
  { id: 3, name: 'Michael Johnson', email: 'michael@example.com', role: 'admin', requestedAt: '2023-10-15' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'user', requestedAt: '2023-10-15' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard 
            title="Total Users" 
            value={dashboardStats.totalUsers} 
            icon={<PeopleIcon />} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard 
            title="Active Users" 
            value={dashboardStats.activeUsers} 
            icon={<PersonAddIcon />} 
            color="success" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard 
            title="Pending Approvals" 
            value={dashboardStats.pendingApprovals} 
            icon={<AssignmentIcon />} 
            color="warning" 
          />
        </Grid>
        
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              User Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#2563eb" name="Total Users" />
                <Line type="monotone" dataKey="active" stroke="#10b981" name="Active Users" />
              </LineChart>
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
              {recentActivity.slice(0, 3).map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <AccessTimeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${activity.user} — ${activity.timestamp}`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Pending Approvals */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Pending Approvals
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/user-verification')}
                startIcon={<VerifiedUserIcon />}
              >
                Go to User Verification
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {pendingApprovals.map((approval) => (
                <Grid item xs={12} sm={6} md={3} key={approval.id}>
                  <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {approval.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {approval.email}
                    </Typography>
                    <Typography variant="body2">
                      Role: <strong>{approval.role}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Requested: {approval.requestedAt}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" size="small" color="success" sx={{ flex: 1 }}>
                        Approve
                      </Button>
                      <Button variant="outlined" size="small" color="error" sx={{ flex: 1 }}>
                        Deny
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        
        {/* Action Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <ActionCard
            title="User Management"
            description="Add, edit, or remove user accounts. Manage permissions and roles."
            action="Manage Users"
            onClick={() => navigate('/users')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <ActionCard
            title="User Verification"
            description="Review and verify user accounts. Approve or disapprove user registrations."
            action="Verify Users"
            onClick={() => navigate('/user-verification')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <ActionCard
            title="View Reports"
            description="Access analytical reports and insights on user activities and system usage."
            action="View Reports"
            onClick={() => navigate('/reports')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;