import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, 
  Toolbar, 
  CssBaseline, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  // Handle responsive sidebar state
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  // Handle closing sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* App header/top bar */}
      <Header 
        open={open} 
        handleDrawerToggle={handleDrawerToggle} 
      />
      
      {/* Sidebar/navigation drawer */}
      <Sidebar 
        open={open} 
        handleDrawerClose={handleDrawerClose} 
        drawerWidth={240} 
      />
      
      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { 
            xs: '100%',
            sm: `calc(100% - ${open ? 240 : theme.spacing(7)}px)` 
          },
          ml: { 
            xs: 0,
            sm: `${open ? 240 : theme.spacing(7)}px` 
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Toolbar spacer to prevent content from going under the app bar */}
        <Toolbar />
        
        {/* Scrollable content container */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            pt: 1,
            pb: 4,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;