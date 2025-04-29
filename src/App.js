import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import SuperAdminDashboard from './components/Dashboard/SuperAdminDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import UserList from './components/UserManagement/UserList';
import RequireAuth from './components/Auth/RequireAuth';
import AuditLogsPage from './components/Dashboard/AuditLogsPage.js'

function App() {
  // Dashboard component based on user role
  const DashboardByRole = () => {
    return (
      <RequireAuth>
        <Routes>
          <Route 
            path="/" 
            element={
              <RoleBasedDashboard />
            } 
          />
          <Route 
            path="/users" 
            element={
              <RequireAuth allowedRoles={['admin', 'superadmin']}>
                <UserList />
              </RequireAuth>
            } 
          />
          <Route 
            path="/admins" 
            element={
              <RequireAuth allowedRoles={['superadmin']}>
                <div>Admin Management Page</div>
              </RequireAuth>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <RequireAuth allowedRoles={['admin', 'superadmin']}>
                <div>Reports Page</div>
              </RequireAuth>
            } 
          />

          {/* <Route 
            path="/audit" 
            element={
              <RequireAuth allowedRoles={['superadmin']}>
                <div>Audit Logs Page</div>
              </RequireAuth>
            } 
          /> */}
          <Route 
            path="/profile" 
            element={
              <RequireAuth>
                <div>Profile Page</div>
              </RequireAuth>
            } 
          />
          <Route 
            path="/audit" 
            element={
              <RequireAuth allowedRoles={['superadmin']}>
                <AuditLogsPage />
              </RequireAuth>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <RequireAuth>
                <div>Settings Page</div>
              </RequireAuth>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RequireAuth>
    );
  };

  // Show different dashboard based on user role
  const RoleBasedDashboard = () => {
    return (
      <RequireAuth>
        {({ currentUser }) => {
          if (currentUser.role === 'superadmin') {
            return <SuperAdminDashboard />;
          } else if (currentUser.role === 'admin') {
            return <AdminDashboard />;
          } else {
            return <UserDashboard />;
          }
        }}
      </RequireAuth>
    );
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <DashboardLayout>
              <DashboardByRole />
            </DashboardLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;