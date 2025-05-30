import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Chip,
  styled,
  Popper,
  Autocomplete,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { apiRequest } from '../../contexts/AuthContext'; // Import the authenticated API request function

// Custom styled components
const StyledSelect = styled(Select)(({ theme }) => ({
  height: 40,
  fontSize: 14,
  backgroundColor: '#fff',
  '& .MuiSelect-select': {
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 12,
    paddingRight: 32
  },
  '& .MuiSelect-icon': {
    right: 8,
    color: '#666'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ced4da'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#adb5bd'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1976d2',
    borderWidth: 1
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: 40,
    fontSize: 14,
    '& fieldset': {
      borderColor: '#ced4da'
    },
    '&:hover fieldset': {
      borderColor: '#adb5bd'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      borderWidth: 1
    },
    '& input': {
      padding: '9px 12px',
    }
  }
}));

const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: 'white',
  textTransform: 'none',
  height: 40,
  padding: '0 24px',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#1565c0',
    boxShadow: 'none'
  }
}));

const ResetButton = styled(Button)(({ theme }) => ({
  borderColor: '#1976d2',
  color: '#1976d2',
  textTransform: 'none',
  height: 40,
  padding: '0 24px',
  '&:hover': {
    borderColor: '#1565c0',
    backgroundColor: 'rgba(25, 118, 210, 0.04)'
  }
}));

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
      width: 'auto',
      marginTop: 1,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      borderRadius: 4
    }
  },
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left'
  },
  getContentAnchorEl: null
};

const UserVerificationPage = () => {
  // State for search filters
  const [stateSearch, setStateSearch] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [assembly, setAssembly] = useState('');
  const [pollingBoothId, setPollingBoothId] = useState('');
  const [userName, setUserName] = useState('');
  const [verificationFilter, setVerificationFilter] = useState(''); // '', 'verified', 'unverified'
  
  // State for hierarchical location data
  const [states, setStates] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableAssemblies, setAvailableAssemblies] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  
  // State for table data and pagination  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // State for selected user
  const [selectedUser, setSelectedUser] = useState(null);
  
  // State for approval/disapproval dialog
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [disapprovalDialogOpen, setDisapprovalDialogOpen] = useState(false);
  const [disapprovalReason, setDisapprovalReason] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);
  
  // Snackbar for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Debounced function for state search with real API
  const debouncedFetchStates = useCallback(
    debounce((searchValue) => {
      fetchStatesData(searchValue);
    }, 300),
    []
  );

  // Load initial states data on component mount
  useEffect(() => {
    fetchStatesData(); // Load initial states
  }, []);

  // Fetch users when page or rowsPerPage changes
  useEffect(() => {
    // Fetch users if we have already performed a search or we're not on first page
    if (page > 0 || users.length > 0) {
      fetchUsers();
    }
  }, [page, rowsPerPage]);

  // Update available districts when state changes
  useEffect(() => {
    if (state) {
      const selectedStateObj = states.find(s => s.name === state);
      if (selectedStateObj) {
        setAvailableDistricts(selectedStateObj.districts || []);
      } else {
        setAvailableDistricts([]);
      }
      setDistrict('');
      setAssembly('');
      setAvailableAssemblies([]);
    } else {
      setAvailableDistricts([]);
      setDistrict('');
      setAssembly('');
      setAvailableAssemblies([]);
    }
  }, [state, states]);

  // Update available assemblies when district changes
  useEffect(() => {
    if (district && availableDistricts.length > 0) {
      const selectedDistrictObj = availableDistricts.find(d => d.name === district);
      if (selectedDistrictObj) {
        setAvailableAssemblies(selectedDistrictObj.assemblies || []);
      } else {
        setAvailableAssemblies([]);
      }
      setAssembly('');
    } else {
      setAvailableAssemblies([]);
      setAssembly('');
    }
  }, [district, availableDistricts]);

  // Fetch hierarchical states data from real API with Bearer token
  const fetchStatesData = async (searchValue = '') => {
    setStatesLoading(true);
    
    try {
      console.log('🌍 Fetching states with search:', searchValue);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('need_hierarchy', 'true'); // Important: get hierarchical data
      
      if (searchValue) {
        params.append('name_like', searchValue);
      }
      
      // Use apiRequest which automatically includes Bearer token
      const response = await apiRequest(`http://localhost:4444/api/v1/admin/states?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`States API failed with status ${response.status}`);
      }
      
      const result = await response.json();
      console.log('🌍 States API response:', result);
      
      if (result.data && Array.isArray(result.data)) {
        // Ensure each state has proper structure with id, name, and districts
        const formattedStates = result.data.map(state => ({
          id: state.id,
          name: state.name,
          districts: Array.isArray(state.districts) ? state.districts.map(district => ({
            id: district.id,
            name: district.name,
            assemblies: Array.isArray(district.assemblies) ? district.assemblies.map(assembly => ({
              id: assembly.id,
              name: assembly.name,
              polling_booths: Array.isArray(assembly.polling_booths) ? assembly.polling_booths.map(pb => ({
                id: pb.id,
                name: pb.name,
                number: pb.number
              })) : []
            })) : []
          })) : []
        }));
        
        setStates(formattedStates);
        
        // Auto-select if only one state and there's a search value
        if (formattedStates.length === 1 && stateSearch) {
          setState(formattedStates[0].name);
          setStateSearch(formattedStates[0].name);
        }
      } else {
        console.warn('⚠️ Invalid states data format:', result);
        setStates([]);
      }
    } catch (error) {
      console.error('❌ Error fetching states:', error);
      setSnackbar({
        open: true,
        message: `Error fetching location data: ${error.message}`,
        severity: 'error'
      });
      setStates([]);
    } finally {
      setStatesLoading(false);
    }
  };

  // Fetch users from real API with Bearer token - POST request implementation
  const fetchUsers = async () => {
    setLoading(true);
    
    try {
      console.log('👥 Fetching users with filters:', {
        state, district, assembly, pollingBoothId, userName, verificationFilter, page, rowsPerPage
      });
      
      // Build request body for the Go API with lowercase field names (as per working curl)
      const requestBody = {};
      
      // Add pagination - Go API expects limit and offset in URL params
      const params = new URLSearchParams();
      params.append('limit', rowsPerPage.toString());
      params.append('offset', (page * rowsPerPage).toString());
      
      // Add search filters to request body
      // Using lowercase field names as per your working curl example
      
      // Find and add state ID
      if (state) {
        const selectedStateObj = states.find(s => s.name === state);
        if (selectedStateObj) {
          requestBody.state = selectedStateObj.id; // lowercase as per curl
          console.log('🏛️ Selected state ID:', selectedStateObj.id);
        }
      }
      
      // Find and add district ID
      if (district && availableDistricts.length > 0) {
        const selectedDistrictObj = availableDistricts.find(d => d.name === district);
        if (selectedDistrictObj) {
          requestBody.district = selectedDistrictObj.id; // lowercase as per API
          console.log('🏘️ Selected district ID:', selectedDistrictObj.id);
        }
      }
      
      // Find and add assembly ID
      if (assembly && availableAssemblies.length > 0) {
        const selectedAssemblyObj = availableAssemblies.find(a => a.name === assembly);
        if (selectedAssemblyObj) {
          requestBody.assembly = selectedAssemblyObj.id; // lowercase as per API
          console.log('🏛️ Selected assembly ID:', selectedAssemblyObj.id);
        }
      }
      
      // Add polling booth ID (if it's a number, convert to int)
      if (pollingBoothId) {
        const pollingBoothIdNum = parseInt(pollingBoothId, 10);
        if (!isNaN(pollingBoothIdNum)) {
          requestBody.polling_booth = pollingBoothIdNum; // lowercase as per API
          console.log('🗳️ Selected polling booth ID:', pollingBoothIdNum);
        } else {
          console.warn('⚠️ Polling booth ID is not a number:', pollingBoothId);
        }
      }
      
      // Add user name search
      if (userName && userName.trim()) {
        requestBody.name = userName.trim(); // lowercase as per API
        console.log('👤 Searching for user name:', userName.trim());
      }
      
      // Add verification status filter
      if (verificationFilter === 'verified') {
        requestBody.is_verified = true; // lowercase as per API
      } else if (verificationFilter === 'unverified') {
        requestBody.is_verified = false; // lowercase as per API
      }
      // If verificationFilter is '', don't add is_verified to get all users
      
      console.log('📤 Request body:', requestBody);
      console.log('📤 URL params:', params.toString());
      
      // Make POST request with request body
      const url = `http://localhost:4444/api/v1/admin/client-users?${params.toString()}`;
      const response = await apiRequest(url, {
        method: 'POST', // POST request for browser compatibility
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`Users API failed with status ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('👥 Users API response:', result);
      
      if (result.data && Array.isArray(result.data)) {
        // Map the response to match your frontend expectations
        const mappedUsers = result.data.map(user => ({
          id: user.id,
          name: user.name || 'N/A',
          mobile_number: user.mobile_number || 'N/A',
          state: user.state || 'N/A',
          district: user.district || 'N/A', 
          assembly: user.assembly || 'N/A',
          caste: user.caste || 'N/A',
          type: user.type || 'N/A',
          created_at: user.created_at,
          verified: user.is_verified || false,
          // Add any other fields your API returns
          ...user
        }));
        
        setUsers(mappedUsers);
        
        // Set pagination info - Go API returns pagination in response
        if (result.pagination) {
          setTotalUsers(result.pagination.total || 0);
        } else if (result.meta) {
          setTotalUsers(result.meta.total || 0);
        } else {
          // Fallback: use array length if no pagination info
          setTotalUsers(mappedUsers.length);
        }
      } else {
        console.warn('⚠️ Invalid users data format:', result);
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    console.log('🔍 Starting user search...');
    
    // No validation - API accepts empty body and will return all users
    setPage(0); // Reset to first page
    fetchUsers();
  };

  const handleReset = () => {
    console.log('🔄 Resetting all filters...');
    setStateSearch('');
    setState('');
    setDistrict('');
    setAssembly('');
    setPollingBoothId('');
    setUserName('');
    setVerificationFilter(''); // Reset verification filter
    setAvailableDistricts([]);
    setAvailableAssemblies([]);
    setPage(0);
    setUsers([]);
    setTotalUsers(0);
    setSelectedUser(null);
    // Reload initial states
    fetchStatesData();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(selectedUser && selectedUser.id === user.id ? null : user);
  };

  const handleApprovalDialogOpen = () => {
    if (!selectedUser) {
      setSnackbar({
        open: true,
        message: 'Please select a user to approve.',
        severity: 'warning'
      });
      return;
    }
    setApprovalDialogOpen(true);
  };

  const handleDisapprovalDialogOpen = () => {
    if (!selectedUser) {
      setSnackbar({
        open: true,
        message: 'Please select a user to disapprove.',
        severity: 'warning'
      });
      return;
    }
    setDisapprovalDialogOpen(true);
  };

  // Helper function to get current admin user UUID from token or auth context
  const getCurrentAdminUUID = () => {
    // Replace this with the actual way to get the current admin's UUID in your app
    try {
      // Option 1: Hard-coded for testing (replace with actual implementation)
      const testUUID = "40471e5e-7f62-452f-93ba-fd61ac3a4869";
      console.log('🔑 Using admin UUID for testing:', testUUID);
      return testUUID;
      
      // Option 2: If available in auth context (uncomment and modify as needed)
      // return authContext.user?.uuid || authContext.user?.id;
      
      // Option 3: Decode from JWT token (if you have jwt-decode)
      // const token = localStorage.getItem('token');
      // const decoded = jwt_decode(token);
      // return decoded.user?.uuid;
      
    } catch (error) {
      console.error('Error getting admin UUID:', error);
      return null;
    }
  };

  // Helper function to get auth token - for debugging
  const getAuthToken = () => {
    // This is for debugging - replace with your actual token retrieval
    try {
      // Try different storage locations
      return localStorage.getItem('token') || 
             localStorage.getItem('authToken') || 
             sessionStorage.getItem('token') ||
             sessionStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  // Approve user with real API and Bearer token - Fixed to handle 204 response
  const handleApprove = async () => {
    setActionInProgress(true);
    
    try {
      console.log('✅ Approving user:', selectedUser.id);
      
      const adminUUID = getCurrentAdminUUID();
      if (!adminUUID) {
        throw new Error('Unable to get admin user ID');
      }
      
      console.log('🔑 Admin UUID:', adminUUID);
      console.log('📤 Making approval request...');
      
      // Use the correct API endpoint matching your curl command
      const response = await apiRequest(
        `http://localhost:4444/api/v1/admin/client-users/${selectedUser.id}/verify`,
        {
          method: 'POST',
          headers: {
            'accept': '*/*',
            'verified_by': adminUUID, // Add the verified_by header as per your curl
            // Note: Content-Type and Authorization are handled by apiRequest
          },
          body: JSON.stringify({
            is_verified: true // Match your curl body structure
          }),
        }
      );
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Approval API Error:', errorText);
        throw new Error(`Approval failed: ${response.status} - ${errorText}`);
      }
      
      // Handle 204 No Content response (success without body)
      let result = null;
      if (response.status === 204) {
        console.log('✅ User approved successfully (204 No Content)');
        result = { success: true, message: 'User approved' };
      } else {
        try {
          result = await response.json();
          console.log('✅ User approved successfully:', result);
        } catch (parseError) {
          // If JSON parsing fails but response is ok, treat as success
          console.log('✅ User approved successfully (no JSON response)');
          result = { success: true, message: 'User approved' };
        }
      }
      
      setSnackbar({
        open: true,
        message: `User ${selectedUser.name} has been approved successfully.`,
        severity: 'success'
      });
      
      // Update the user in the list
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, verified: true } : user
      ));
      
      setSelectedUser(null);
    } catch (error) {
      console.error('❌ Error approving user:', error);
      setSnackbar({
        open: true,
        message: `Error approving user: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setActionInProgress(false);
      setApprovalDialogOpen(false);
    }
  };

  // Disapprove user with real API and Bearer token - Updated to include required comment
  const handleDisapprove = async () => {
    // Validate comment is provided (required by API for disapproval)
    if (!disapprovalReason.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide a reason for disapproval. Comment is required.',
        severity: 'warning'
      });
      return;
    }
    
    setActionInProgress(true);
    
    try {
      console.log('❌ Disapproving user:', selectedUser.id, 'Comment:', disapprovalReason);
      
      const adminUUID = getCurrentAdminUUID();
      if (!adminUUID) {
        throw new Error('Unable to get admin user ID');
      }
      
      console.log('🔑 Admin UUID:', adminUUID);
      console.log('📤 Making disapproval request...');
      
      // Use the correct API endpoint matching your curl command
      const response = await apiRequest(
        `http://localhost:4444/api/v1/admin/client-users/${selectedUser.id}/verify`,
        {
          method: 'POST',
          headers: {
            'accept': '*/*',
            'verified_by': adminUUID, // Add the verified_by header as per your curl
            // Note: Content-Type and Authorization are handled by apiRequest
          },
          body: JSON.stringify({
            is_verified: false, // Set to false for disapproval
            comment: disapprovalReason.trim() // Required comment field for disapproval
          }),
        }
      );
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Disapproval API Error:', errorText);
        throw new Error(`Disapproval failed: ${response.status} - ${errorText}`);
      }
      
      // Handle 204 No Content response (success without body)
      let result = null;
      if (response.status === 204) {
        console.log('❌ User disapproved successfully (204 No Content)');
        result = { success: true, message: 'User disapproved' };
      } else {
        try {
          result = await response.json();
          console.log('❌ User disapproved successfully:', result);
        } catch (parseError) {
          // If JSON parsing fails but response is ok, treat as success
          console.log('❌ User disapproved successfully (no JSON response)');
          result = { success: true, message: 'User disapproved' };
        }
      }
      
      setSnackbar({
        open: true,
        message: `User ${selectedUser.name} has been disapproved successfully.`,
        severity: 'success'
      });
      
      // Update the user in the list
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, verified: false } : user
      ));
      
      setSelectedUser(null);
      setDisapprovalReason('');
    } catch (error) {
      console.error('❌ Error disapproving user:', error);
      setSnackbar({
        open: true,
        message: `Error disapproving user: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setActionInProgress(false);
      setDisapprovalDialogOpen(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get selected location info for debugging
  const getSelectedLocationInfo = () => {
    const selectedStateObj = states.find(s => s.name === state);
    const selectedDistrictObj = availableDistricts.find(d => d.name === district);
    const selectedAssemblyObj = availableAssemblies.find(a => a.name === assembly);
    
    return {
      stateId: selectedStateObj?.id,
      stateName: selectedStateObj?.name,
      districtId: selectedDistrictObj?.id,
      districtName: selectedDistrictObj?.name,
      assemblyId: selectedAssemblyObj?.id,
      assemblyName: selectedAssemblyObj?.name,
      pollingBoothId: pollingBoothId
    };
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 4, fontWeight: 500 }}>
        User Verification
      </Typography>
      
      {/* Search Filters */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 1, 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          background: '#fff' 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 500 }}>
            Search Filters
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              State
            </Typography>
            <Autocomplete
              freeSolo
              options={states.map(s => s.name)}
              inputValue={stateSearch}
              onInputChange={(event, newValue) => {
                setStateSearch(newValue);
                if (newValue && newValue.length >= 2) {
                  debouncedFetchStates(newValue);
                } else if (!newValue) {
                  setState('');
                }
              }}
              onChange={(event, newValue) => {
                setState(newValue || '');
              }}
              loading={statesLoading}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  placeholder="Type to search states..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {statesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
              noOptionsText="No states found"
              PopperComponent={(props) => (
                <Popper
                  {...props}
                  style={{
                    ...props.style,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    borderRadius: 4
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              District
            </Typography>
            <FormControl fullWidth>
              <StyledSelect
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                displayEmpty
                disabled={!state || availableDistricts.length === 0}
                IconComponent={ArrowDownIcon}
                MenuProps={MenuProps}
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: '#888' }}>
                      {state && availableDistricts.length === 0 ? 'No districts available' : 'Select District'}
                    </span>;
                  }
                  return selected;
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select District</em>
                </MenuItem>
                {availableDistricts.map((districtObj) => (
                  <MenuItem key={districtObj.id} value={districtObj.name}>
                    {districtObj.name}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Assembly
            </Typography>
            <FormControl fullWidth>
              <StyledSelect
                value={assembly}
                onChange={(e) => setAssembly(e.target.value)}
                displayEmpty
                disabled={!district || availableAssemblies.length === 0}
                IconComponent={ArrowDownIcon}
                MenuProps={MenuProps}
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: '#888' }}>
                      {district && availableAssemblies.length === 0 ? 'No assemblies available' : 'Select Assembly'}
                    </span>;
                  }
                  return selected;
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select Assembly</em>
                </MenuItem>
                {availableAssemblies.map((assemblyObj) => (
                  <MenuItem key={assemblyObj.id} value={assemblyObj.name}>
                    {assemblyObj.name}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Polling Booth ID
            </Typography>
            <StyledTextField
              fullWidth
              placeholder="Enter polling booth ID"
              value={pollingBoothId}
              onChange={(e) => setPollingBoothId(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Verification Status
            </Typography>
            <FormControl fullWidth>
              <StyledSelect
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                displayEmpty
                IconComponent={ArrowDownIcon}
                MenuProps={MenuProps}
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: '#888' }}>All Users</span>;
                  }
                  return selected === 'verified' ? 'Verified Only' : 'Unverified Only';
                }}
              >
                <MenuItem value="">All Users</MenuItem>
                <MenuItem value="verified">Verified Only</MenuItem>
                <MenuItem value="unverified">Unverified Only</MenuItem>
              </StyledSelect>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Name of User
            </Typography>
            <StyledTextField
              fullWidth
              placeholder="Enter user name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <SearchButton
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={statesLoading || loading}
              >
                Search
              </SearchButton>
              <ResetButton
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                disabled={statesLoading || loading}
              >
                Reset
              </ResetButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* User Table and Actions */}
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 1, 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          background: '#fff',
          mb: 4
        }}
      >
        {/* Action Buttons */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, borderBottom: '1px solid #eee' }}>
          <Button 
            variant="contained"
            color="inherit"
            startIcon={<CheckCircleIcon />}
            disabled={!selectedUser}
            onClick={handleApprovalDialogOpen}
            sx={{ 
              bgcolor: '#f0f0f0',
              color: '#333',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#e0e0e0',
                boxShadow: 'none'
              }
            }}
          >
            Approve
          </Button>
          <Button 
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            disabled={!selectedUser}
            onClick={handleDisapprovalDialogOpen}
            sx={{ 
              borderColor: '#d32f2f',
              borderWidth: 1,
              color: '#d32f2f',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#c62828',
                bgcolor: 'rgba(211, 47, 47, 0.04)'
              }
            }}
          >
            Disapprove
          </Button>
        </Box>
        
        {/* User Table */}
        <TableContainer>
          <Table aria-label="user verification table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ bgcolor: '#f5f5f5' }}>
                  {/* Single selection only */}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Mobile</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>State</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>District</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Assembly</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Caste</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Registered On</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 1 }}>Loading users...</Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      {page === 0 ? 'Click "Search" to load users (leave filters empty to get all users)' : 'No users found matching the criteria'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    selected={selectedUser && selectedUser.id === user.id}
                    hover
                    onClick={() => handleUserSelect(user)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUser && selectedUser.id === user.id}
                        onChange={() => handleUserSelect(user)}
                        inputProps={{ 'aria-label': `select user ${user.name || 'Unknown'}` }}
                      />
                    </TableCell>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.mobile_number || 'N/A'}</TableCell>
                    <TableCell>{user.state || 'N/A'}</TableCell>
                    <TableCell>{user.district || 'N/A'}</TableCell>
                    <TableCell>{user.assembly || 'N/A'}</TableCell>
                    <TableCell>{user.caste || 'N/A'}</TableCell>
                    <TableCell>{user.type || 'N/A'}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      {user.verified ? (
                        <Chip 
                          label="Verified" 
                          size="small" 
                          color="success" 
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      ) : (
                        <Chip 
                          label="Unverified" 
                          size="small" 
                          color="warning"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={totalUsers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Approval Confirmation Dialog */}
      <Dialog
        open={approvalDialogOpen}
        onClose={() => !actionInProgress && setApprovalDialogOpen(false)}
        aria-labelledby="approval-dialog-title"
      >
        <DialogTitle id="approval-dialog-title">
          Confirm User Approval
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve {selectedUser?.name}? This action will mark the user as verified.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setApprovalDialogOpen(false)} 
            disabled={actionInProgress}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApprove} 
            color="success" 
            variant="contained"
            disabled={actionInProgress}
            startIcon={actionInProgress && <CircularProgress size={16} color="inherit" />}
            sx={{ textTransform: 'none' }}
          >
            {actionInProgress ? 'Processing...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Disapproval Dialog with Reason Input */}
      <Dialog
        open={disapprovalDialogOpen}
        onClose={() => !actionInProgress && setDisapprovalDialogOpen(false)}
        aria-labelledby="disapproval-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="disapproval-dialog-title">
          User Disapproval
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a reason for disapproving {selectedUser?.name}. This is mandatory and will be recorded.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="disapproval-reason"
            label="Reason for Disapproval"
            fullWidth
            multiline
            rows={4}
            value={disapprovalReason}
            onChange={(e) => setDisapprovalReason(e.target.value)}
            required
            error={disapprovalReason.trim() === ''}
            helperText={disapprovalReason.trim() === '' ? 'Reason is required' : ''}
            disabled={actionInProgress}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDisapprovalDialogOpen(false)} 
            disabled={actionInProgress}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDisapprove} 
            color="error" 
            variant="contained"
            disabled={actionInProgress || disapprovalReason.trim() === ''}
            startIcon={actionInProgress && <CircularProgress size={16} color="inherit" />}
            sx={{ textTransform: 'none' }}
          >
            {actionInProgress ? 'Processing...' : 'Disapprove'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserVerificationPage;