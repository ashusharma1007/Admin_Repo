import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const RequireAuth = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading, isTokenExpired } = useContext(AuthContext);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // Check if token is expired
  if (isTokenExpired()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has an allowed role
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // User doesn't have the required role, redirect to dashboard
    return <Navigate to="/" replace />;
  }

  // User is logged in and has the required role
  // If children is a function, call it with currentUser
  if (typeof children === 'function') {
    return children({ currentUser });
  }

  // Otherwise, render the children normally
  return children;
};

export default RequireAuth;