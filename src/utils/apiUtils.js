import { apiRequest } from '../contexts/AuthContext';

// API endpoints
export const API_BASE_URL = 'http://localhost:4444/api/v1';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/admin/clr-emp/login`,
  STATES: `${API_BASE_URL}/admin/states`,
  USERS: `${API_BASE_URL}/admin/client-users`,
  USER_VERIFY: (userId) => `${API_BASE_URL}/admin/client-users/${userId}/verify`,
  STATE_PREFERENCES: (stateId) => `${API_BASE_URL}/admin/state/${stateId}/preferences`,
};

// Fetch states with hierarchy
export const fetchStates = async (searchValue = '') => {
  try {
    const params = new URLSearchParams();
    params.append('need_hierarchy', 'true');
    
    if (searchValue) {
      params.append('name_like', searchValue);
    }
    
    const response = await apiRequest(`${API_ENDPOINTS.STATES}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch states: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching states:', error);
    throw error;
  }
};

// Fetch users with search filters
export const fetchUsers = async (filters = {}, page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('offset', page.toString());
    params.append('limit', limit.toString());
    
    // Add search filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    const response = await apiRequest(`${API_ENDPOINTS.USERS}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      users: result.data || [],
      pagination: result.pagination || { total: 0 }
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Verify user (approve/disapprove)
export const verifyUser = async (userId, status, description = '') => {
  try {
    const response = await apiRequest(API_ENDPOINTS.USER_VERIFY(userId), {
      method: 'POST',
      body: JSON.stringify({
        status,
        description
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to verify user: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
};

// Fetch state preferences
export const fetchStatePreferences = async (stateId) => {
  try {
    const response = await apiRequest(API_ENDPOINTS.STATE_PREFERENCES(stateId));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch state preferences: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || {};
  } catch (error) {
    console.error('Error fetching state preferences:', error);
    throw error;
  }
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.message.includes('401')) {
    return 'Session expired. Please login again.';
  } else if (error.message.includes('403')) {
    return 'You do not have permission to perform this action.';
  } else if (error.message.includes('404')) {
    return 'The requested resource was not found.';
  } else if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
};

// Utility function to format user data
export const formatUserData = (user) => {
  return {
    ...user,
    formattedName: user.name || 'N/A',
    formattedMobile: user.mobile_number || 'N/A',
    formattedState: user.state || 'N/A',
    formattedDistrict: user.district || 'N/A',
    formattedAssembly: user.assembly || 'N/A',
    formattedCaste: user.caste || 'N/A',
    formattedType: user.type || 'N/A',
    formattedDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
    isVerified: user.verified || false
  };
};

// Utility function to validate search filters
export const validateSearchFilters = (filters) => {
  const errors = [];
  
  if (filters.pollingBoothId && !/^\d+$/.test(filters.pollingBoothId)) {
    errors.push('Polling Booth ID must be a number');
  }
  
  if (filters.userName && filters.userName.length < 2) {
    errors.push('User name must be at least 2 characters');
  }
  
  return errors;
};