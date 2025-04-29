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
  AccountCircle as AccountCircleIcon
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
    navigate(path);
    if (theme.breakpoints.down('md')) {
      handleDrawerClose();
    }
  };
  
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
      <List component="nav">
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              bgcolor: location.pathname === '/' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
            }}
            onClick={() => handleNavigate('/')}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: location.pathname === '/' ? 'primary.main' : 'inherit',
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        
        {isAdmin && (
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                bgcolor: location.pathname === '/users' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              }}
              onClick={() => handleNavigate('/users')}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: location.pathname === '/users' ? 'primary.main' : 'inherit',
                }}
              >
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        )}
        
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              bgcolor: location.pathname === '/reports' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
            }}
            onClick={() => handleNavigate('/reports')}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: location.pathname === '/reports' ? 'primary.main' : 'inherit',
              }}
            >
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        
        {isSuperAdmin && (
          <>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  bgcolor: location.pathname === '/admins' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                }}
                onClick={() => handleNavigate('/admins')}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === '/admins' ? 'primary.main' : 'inherit',
                  }}
                >
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText primary="Admin Management" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  bgcolor: location.pathname === '/audit' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                }}
                onClick={() => handleNavigate('/audit')}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === '/audit' ? 'primary.main' : 'inherit',
                  }}
                >
                  <GavelIcon />
                </ListItemIcon>
                <ListItemText primary="Audit Logs" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
        
        <Divider sx={{ my: 1 }} />
        
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              bgcolor: location.pathname === '/profile' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
            }}
            onClick={() => handleNavigate('/profile')}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: location.pathname === '/profile' ? 'primary.main' : 'inherit',
              }}
            >
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="My Profile" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              bgcolor: location.pathname === '/settings' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
            }}
            onClick={() => handleNavigate('/settings')}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: location.pathname === '/settings' ? 'primary.main' : 'inherit',
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;