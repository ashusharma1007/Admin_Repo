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
  InputLabel,
  FormHelperText
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  FilePresent as FileIcon,
  Send as SendIcon
} from '@mui/icons-material';

// Mock data for Indian states
const indianStates = [
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'West Bengal', label: 'West Bengal' }
];

// Mock districts by state
const districtsByState = {
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
  'PATNA': [
    { value: '184 - Patna Sahib', label: '184 - Patna Sahib' },
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

// Language options
const languages = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Marathi', label: 'Marathi' }
];

const AuditLogsPage = () => {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [assembly, setAssembly] = useState('');
  const [language, setLanguage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [electoralPorts, setElectoralPorts] = useState('');
  
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
      alert('Please upload a PDF file');
      event.target.value = null;
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  // Function to handle form search/submit
  const handleSearch = () => {
    console.log('Searching with criteria:', { state, district, assembly, language, electoralPorts });
    // In a real application, this would trigger an API call
  };

  const handleSubmit = () => {
    console.log('Submitting uploaded file:', uploadedFile);
    console.log('Form data:', { state, district, assembly, language, electoralPorts });
    // Here you would implement API integration for file upload
  };

  const handleReset = () => {
    setState('');
    setDistrict('');
    setAssembly('');
    setLanguage('');
    setElectoralPorts('');
    setUploadedFile(null);
    setAvailableDistricts([]);
    setAvailableAssemblies([]);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Search Filters Panel */}
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
          Search Filters
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              State
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
              District
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
              Assembly
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
              Language
            </Typography>
            <FormControl fullWidth>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
                    return <span style={{ color: '#888' }}>Select Language</span>;
                  }
                  return selected;
                }}
              >
                <MenuItem value="" disabled>Select Language</MenuItem>
                {languages.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Electoral Ports
            </Typography>
            <TextField 
              fullWidth
              placeholder="Enter report details"
              value={electoralPorts}
              onChange={(e) => setElectoralPorts(e.target.value)}
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
                variant="contained" 
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ 
                  bgcolor: '#1976d2', 
                  '&:hover': { bgcolor: '#1565c0' },
                  borderRadius: 1,
                  py: 1,
                  px: 3,
                  textTransform: 'none',
                  fontSize: '0.95rem'
                }}
              >
                Search
              </Button>
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
                Reset
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
          {!uploadedFile ? (
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
                startIcon={<SendIcon />}
                onClick={handleSubmit}
                sx={{ 
                  bgcolor: '#2e7d32', 
                  '&:hover': { bgcolor: '#1b5e20' },
                  borderRadius: 1,
                  py: 1,
                  px: 3,
                  textTransform: 'none',
                  fontSize: '0.95rem'
                }}
              >
                Submit Document
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AuditLogsPage;