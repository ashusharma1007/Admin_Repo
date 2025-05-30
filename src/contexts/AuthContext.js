import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// API utility function to make authenticated requests
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  const response = await fetch(url, config);
  
  // Handle token expiration
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login';
    return;
  }
  
  return response;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:4444/api/v1/admin/clr-emp/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();
      
      if (result.data && result.data.access_token) {
        const { access_token, refresh_token, expires_at } = result.data;
        
        // Store tokens
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('expires_at', expires_at.toString());
        
        // Decode user information from JWT token (basic extraction)
        // In a real app, you might want to use a proper JWT library
        const tokenPayload = JSON.parse(atob(access_token.split('.')[1]));
        
        // Create user object (you might need to adjust this based on your actual token structure)
        const user = {
          id: tokenPayload.user?.uuid || tokenPayload.sub,
          email: email,
          name: email.split('@')[0], // Fallback name from email
          role: tokenPayload.user?.type_id === 1 ? 'admin' : 'user', // Adjust based on your role system
          uuid: tokenPayload.user?.uuid
        };
        
        localStorage.setItem('user_data', JSON.stringify(user));
        setCurrentUser(user);
        
        return user;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user_data');
    setCurrentUser(null);
  };

  const hasPermission = (requiredRole) => {
    if (!currentUser) return false;
    
    const roleHierarchy = {
      'superadmin': 3,
      'admin': 2,
      'user': 1
    };
    
    const userLevel = roleHierarchy[currentUser.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
  };

  // Check if token is expired
  const isTokenExpired = () => {
    const expiresAt = localStorage.getItem('expires_at');
    if (!expiresAt) return true;
    
    return Date.now() / 1000 > parseInt(expiresAt);
  };

  // Auto-logout if token is expired
  useEffect(() => {
    if (currentUser && isTokenExpired()) {
      logout();
    }
  }, [currentUser]);

  const value = {
    currentUser,
    login,
    logout,
    hasPermission,
    loading,
    isTokenExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };