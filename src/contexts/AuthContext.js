import React, { createContext, useState, useEffect } from 'react';
import { users } from '../data/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      // Remove password before storing
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    
    // Super admin has all permissions
    if (currentUser.role === 'superadmin') return true;
    
    // Check specific permissions based on role
    if (currentUser.role === 'admin') {
      const adminPermissions = ['manage_users', 'view_reports', 'edit_content'];
      return adminPermissions.includes(permission);
    }
    
    if (currentUser.role === 'user') {
      const userPermissions = ['view_content', 'edit_profile'];
      return userPermissions.includes(permission);
    }
    
    return false;
  };

  const value = {
    currentUser,
    login,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};