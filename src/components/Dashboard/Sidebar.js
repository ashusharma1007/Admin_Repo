import React, { useContext } from 'react';
import { 
  Drawer, 
  List, 
  Divider, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box,
  Toolbar,
  Typography,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Gavel as GavelIcon,
  PersonAdd as PersonAddIcon,
  AccountCircle as AccountCircleIcon,
  VerifiedUser as VerifiedUserIcon,
  Upload
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar = ({ open, handleDrawerClose, drawerWidth = 240 }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, hasPermission } = useContext(AuthContext);
  
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const isAdmin = currentUser?.role === 'admin' || isSuperAdmin;
  
  const handleNavigate = (path) => {
    console.log('🔗 Navigating to:', path);
    navigate(path);
    
    // Close drawer on mobile after navigation
    if (window.innerWidth < 900 && handleDrawerClose) {
      handleDrawerClose();
    }
  };

  // Navigation items configuration
  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <DashboardIcon />,
      show: true
    },
    {
      label: 'User Management',
      path: '/users',
      icon: <PeopleIcon />,
      show: isAdmin
    },

    {
      label: 'Upload Docs',
      path: '/audit-logs',
      icon: <Upload />,
      show: isAdmin
    },
    {
      label: 'User Verification',
      path: '/user-verification',
      icon: <VerifiedUserIcon />,
      show: isAdmin
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: <BarChartIcon />,
      show: true
    },
    {
      label: 'Audit Logs',
      path: '/audit',
      icon: <GavelIcon />,
      show: isSuperAdmin
    }
  ];

  const personalItems = [
    {
      label: 'My Profile',
      path: '/profile',
      icon: <AccountCircleIcon />,
      show: true
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <SettingsIcon />,
      show: true
    }
  ];
  
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : theme.spacing(7),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : theme.spacing(7),
          boxSizing: 'border-box',
          whiteSpace: 'nowrap',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ...(!open && {
            width: theme.spacing(7),
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }),
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
        }}
      >
        {open && (
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Admin Panel
          </Typography>
        )}
      </Toolbar>
      
      <Divider />
      
      {/* Main Navigation */}
      <List component="nav">
        {navigationItems.map((item) => 
          item.show ? (
            <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  bgcolor: location.pathname === item.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                }}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ) : null
        )}
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      {/* Personal Items */}
      <List component="nav">
        {personalItems.map((item) => 
          item.show ? (
            <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  bgcolor: location.pathname === item.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                }}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ) : null
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;