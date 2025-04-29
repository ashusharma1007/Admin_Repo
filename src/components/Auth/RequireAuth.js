import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const RequireAuth = ({ children, allowedRoles = [] }) => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  if (!currentUser) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has an allowed role
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // User doesn't have the required role, redirect to dashboard
    return <Navigate to="/" replace />;
  }

  // User is logged in and has the required role, render the children
  return children;
};

export default RequireAuth;