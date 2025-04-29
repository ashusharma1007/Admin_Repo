import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { roles } from '../../data/mockData';

const UserForm = ({ open, onClose, onSave, userData, isSuperAdmin }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (userData) {
      setFormData({
        ...userData,
        // Don't show the actual password in the form for security
        password: '' 
      });
    } else {
      setFormData({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active'
      });
    }
    setErrors({});
  }, [userData, open]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!userData && !formData.password.trim()) {
      newErrors.password = 'Password is required for new users';
    } else if (!userData && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  const isEditMode = Boolean(userData?.id);
  const title = isEditMode ? 'Edit User' : 'Add New User';
  
  // Filter roles based on admin privilege
  const availableRoles = roles.filter(role => {
    if (!isSuperAdmin && role.name === 'superadmin') {
      return false;
    }
    return true;
  });
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="password"
              label={isEditMode ? "New Password (leave blank to keep current)" : "Password"}
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                {availableRoles.map(role => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEditMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;