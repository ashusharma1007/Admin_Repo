import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  Select,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  FilePresent as FileIcon,
  Send as SendIcon
} from '@mui/icons-material';

// Mock data for Indian states
const indianStates = [
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'West Bengal', label: 'West Bengal' }
];

// Mock districts by state
const districtsByState = {
  'Karnataka': [
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Mysore', label: 'Mysore' },
    { value: 'Hubli', label: 'Hubli' },
    { value: 'Mangalore', label: 'Mangalore' }
  ],
  'Bihar': [
    { value: 'PATNA', label: 'PATNA' },
    { value: 'GAYA', label: 'GAYA' },
    { value: 'MUZAFFARPUR', label: 'MUZAFFARPUR' }
  ],
  'Delhi': [
    { value: 'CENTRAL DELHI', label: 'CENTRAL DELHI' },
    { value: 'EAST DELHI', label: 'EAST DELHI' },
    { value: 'NEW DELHI', label: 'NEW DELHI' }
  ],
  // Add for other states as needed
};

// Mock assembly constituencies by district
const assembliesByDistrict = {
  'Bangalore': [
    { value: 'Jayanagar', label: 'Jayanagar' },
    { value: 'Basavanagudi', label: 'Basavanagudi' },
    { value: 'Padmanabhanagar', label: 'Padmanabhanagar' },
    { value: 'BTM Layout', label: 'BTM Layout' }
  ],
  'Mysore': [
    { value: 'Chamaraja', label: 'Chamaraja' },
    { value: 'Krishnaraja', label: 'Krishnaraja' },
    { value: 'Narasimharaja', label: 'Narasimharaja' }
  ],
  'PATNA': [
    { value: 'पटना साहिब', label: 'पटना साहिब' },
    { value: '185 - Kumhrar', label: '185 - Kumhrar' },
    { value: '186 - Bankipur', label: '186 - Bankipur' }
  ],
  'GAYA': [
    { value: '220 - Gaya Town', label: '220 - Gaya Town' },
    { value: '221 - Belaganj', label: '221 - Belaganj' },
    { value: '222 - Wazirganj', label: '222 - Wazirganj' }
  ],
  // Add for other districts as needed
};

const AuditLogsPage = () => {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [assembly, setAssembly] = useState('');
  const [pollingBoothName, setPollingBoothName] = useState('');
  const [pollingBoothNumber, setPollingBoothNumber] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // API request states
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState(null);

  // Available districts based on selected state
  const [availableDistricts, setAvailableDistricts] = useState([]);
  // Available assembly constituencies based on selected district
  const [availableAssemblies, setAvailableAssemblies] = useState([]);

  // Update available districts when state changes
  useEffect(() => {
    if (state) {
      const districts = districtsByState[state] || [];
      setAvailableDistricts(districts);
      setDistrict(''); // Reset district when state changes
      setAssembly(''); // Reset assembly when state changes
      setAvailableAssemblies([]); // Clear available assemblies
    } else {
      setAvailableDistricts([]);
      setDistrict('');
      setAssembly('');
      setAvailableAssemblies([]);
    }
  }, [state]);

  // Update available assemblies when district changes
  useEffect(() => {
    if (district) {
      const assemblies = assembliesByDistrict[district] || [];
      setAvailableAssemblies(assemblies);
      setAssembly(''); // Reset assembly when district changes
    } else {
      setAvailableAssemblies([]);
      setAssembly('');
    }
  }, [district]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    } else {
      setSnackbar({
        open: true,
        message: 'Please upload a PDF file',
        severity: 'error'
      });
      event.target.value = null;
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileUploaded(false);
    setUploadedFileData(null);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!state || !district || !assembly || !pollingBoothName || !pollingBoothNumber || !uploadedFile) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields and upload a PDF file',
        severity: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      // Create FormData object to send multipart form data
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('state', state);
      formData.append('district', district);
      formData.append('assembly_name', assembly);
      formData.append('polling_booth_name', pollingBoothName);
      formData.append('polling_booth_number', pollingBoothNumber);

      // Make API request
      const response = await fetch('http://localhost:4444/api/v1/admin/voter-list', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      setSnackbar({
        open: true,
        message: data.data.message || 'File uploaded successfully',
        severity: 'success'
      });
      
      setFileUploaded(true);
      setUploadedFileData(data.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setState('');
    setDistrict('');
    setAssembly('');
    setPollingBoothName('');
    setPollingBoothNumber('');
    setUploadedFile(null);
    setFileUploaded(false);
    setUploadedFileData(null);
    setAvailableDistricts([]);
    setAvailableAssemblies([]);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Form Panel */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 1, 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          background: '#fff' 
        }}
      >
        <Typography variant="h6" sx={{ mb: 4, fontWeight: 500, color: '#333' }}>
          Upload Voter List
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              State <span style={{ color: 'red' }}>*</span>
            </Typography>
            <FormControl fullWidth>
              <Select
                value={state}
                onChange={(e) => setState(e.target.value)}
                displayEmpty
                sx={{ 
                  borderRadius: 1, 
                  height: 40,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ddd'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#aaa'
                  }
                }}
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: '#888' }}>Select</span>;
                  }
                  return selected;
                }}
              >
                <MenuItem value="" disabled>Select</MenuItem>
                {indianStates.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              District <span style={{ color: 'red' }}>*</span>
            </Typography>
            <FormControl fullWidth>
              <Select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                displayEmpty
                disabled={!state}
                sx={{ 
                  borderRadius: 1, 
                  height: 40,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ddd'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#aaa'
                  }
                }}
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: '#888' }}>Select</span>;
                  }
                  return selected;
                }}
              >
                <MenuItem value="" disabled>Select</MenuItem>
                {availableDistricts.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Assembly <span style={{ color: 'red' }}>*</span>
            </Typography>
            <FormControl fullWidth>
              <Select
                value={assembly}
                onChange={(e) => setAssembly(e.target.value)}
                displayEmpty
                disabled={!district}
                sx={{ 
                  borderRadius: 1, 
                  height: 40,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ddd'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#aaa'
                  }
                }}
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: '#888' }}>Select</span>;
                  }
                  return selected;
                }}
              >
                <MenuItem value="" disabled>Select</MenuItem>
                {availableAssemblies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Polling Booth Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField 
              fullWidth
              placeholder="Enter polling booth name"
              value={pollingBoothName}
              onChange={(e) => setPollingBoothName(e.target.value)}
              InputProps={{
                sx: { 
                  borderRadius: 1,
                  height: 40,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ddd'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#aaa'
                  }
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Polling Booth Number <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField 
              fullWidth
              placeholder="Enter polling booth number"
              value={pollingBoothNumber}
              onChange={(e) => setPollingBoothNumber(e.target.value)}
              InputProps={{
                sx: { 
                  borderRadius: 1,
                  height: 40,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ddd'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#aaa'
                  }
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined"
                onClick={handleReset}
                startIcon={<RefreshIcon />}
                sx={{ 
                  borderColor: '#1976d2', 
                  color: '#1976d2',
                  '&:hover': { 
                    borderColor: '#1565c0',
                    bgcolor: 'rgba(25, 118, 210, 0.04)'
                  },
                  borderRadius: 1,
                  py: 1,
                  px: 3,
                  textTransform: 'none',
                  fontSize: '0.95rem'
                }}
              >
                Reset Form
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Document Upload Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 1, 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          background: '#fff'
        }}
      >
        <Typography variant="h6" sx={{ mb: 4, fontWeight: 500, color: '#333' }}>
          Document Upload
        </Typography>
        
        <Box 
          sx={{ 
            border: '1px dashed #c5c5c5', 
            borderRadius: 1, 
            p: 4, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#fafafa',
            minHeight: 150
          }}
        >
          {fileUploaded && uploadedFileData ? (
            <Box sx={{ textAlign: 'center' }}>
              <Chip 
                color="success" 
                label="File uploaded successfully" 
                sx={{ mb: 2, px: 2, py: 1 }} 
              />
              <Typography variant="body1" sx={{ mb: 1 }}>
                File: <strong>{uploadedFileData.file_name}</strong>
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Polling Booth ID: <strong>{uploadedFileData.polling_booth_id}</strong>
              </Typography>
              <Button 
                variant="outlined" 
                onClick={handleReset}
                sx={{ 
                  borderRadius: 1,
                  textTransform: 'none'
                }}
              >
                Upload Another Document
              </Button>
            </Box>
          ) : !uploadedFile ? (
            <>
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="raised-button-file">
                <Button 
                  variant="contained" 
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{ 
                    bgcolor: '#1976d2', 
                    '&:hover': { bgcolor: '#1565c0' },
                    borderRadius: 1,
                    py: 1.2,
                    px: 3,
                    textTransform: 'none',
                    fontSize: '0.95rem'
                  }}
                >
                  Upload PDF Document
                </Button>
              </label>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 2, textAlign: 'center' }}
              >
                Supported format: PDF only, max size: 10MB
              </Typography>
            </>
          ) : (
            <>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  width: '100%',
                  bgcolor: '#f5f5f5',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  mb: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FileIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" fontWeight={500}>{uploadedFile.name}</Typography>
                  <Chip 
                    label={`${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`} 
                    size="small" 
                    sx={{ ml: 2, bgcolor: '#e3f2fd', color: '#1976d2' }} 
                  />
                </Box>
                <IconButton onClick={handleRemoveFile} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ 
                  bgcolor: '#2e7d32', 
                  '&:hover': { bgcolor: '#1b5e20' },
                  borderRadius: 1,
                  py: 1,
                  px: 3,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  minWidth: 180
                }}
              >
                {loading ? 'Uploading...' : 'Submit Document'}
              </Button>
            </>
          )}
        </Box>
      </Paper>

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
          sx={{ width: '100%', boxShadow: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuditLogsPage;