import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DataTable from '../UI/DataTable';
import UserForm from './UserForm';
import { users } from '../../data/mockData';
import { AuthContext } from '../../contexts/AuthContext';
import { getUserRoleLabel } from '../../utils/auth';

const UserList = () => {
  const [tableData, setTableData] = useState(users);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  
  const { currentUser: loggedInUser } = useContext(AuthContext);
  const isSuperAdmin = loggedInUser.role === 'superadmin';
  
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { 
      id: 'role', 
      label: 'Role',
      renderCell: (row) => getUserRoleLabel(row.role)
    },
    { id: 'status', label: 'Status', type: 'status' },
    { id: 'created', label: 'Created', type: 'date' }
  ];
  
  const handleOpenUserForm = (user = null) => {
    setCurrentUser(user);
    setOpenUserForm(true);
  };
  
  const handleCloseUserForm = () => {
    setOpenUserForm(false);
    setCurrentUser(null);
  };
  
  const handleSaveUser = (userData) => {
    if (userData.id) {
      // Update existing user
      setTableData(tableData.map(user => 
        user.id === userData.id ? userData : user
      ));
      setAlert({
        show: true,
        message: 'User updated successfully',
        severity: 'success'
      });
    } else {
      // Add new user with generated ID
      const newUser = {
        ...userData,
        id: tableData.length + 1,
        created: new Date().toISOString().split('T')[0]
      };
      setTableData([...tableData, newUser]);
      setAlert({
        show: true,
        message: 'User added successfully',
        severity: 'success'
      });
    }
    
    handleCloseUserForm();
  };
  
  const handleEdit = (user) => {
    handleOpenUserForm(user);
  };
  
  const handleDelete = (user) => {
    setUserToDelete(user);
    setOpenDelete(true);
  };
  
  const confirmDelete = () => {
    setTableData(tableData.filter(user => user.id !== userToDelete.id));
    setOpenDelete(false);
    setUserToDelete(null);
    setAlert({
      show: true,
      message: 'User deleted successfully',
      severity: 'success'
    });
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenUserForm()}
        >
          Add User
        </Button>
      </Box>
      
      {alert.show && (
        <Alert 
          severity={alert.severity} 
          sx={{ mb: 3 }}
          onClose={() => setAlert({ ...alert, show: false })}
        >
          {alert.message}
        </Alert>
      )}
      
      <DataTable 
        columns={columns} 
        data={tableData} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <UserForm 
        open={openUserForm} 
        onClose={handleCloseUserForm}
        onSave={handleSaveUser}
        userData={currentUser}
        isSuperAdmin={isSuperAdmin}
      />
      
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;