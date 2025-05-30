import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SecurityProvider from './components/Dashboard/SecurityProvider';
import Login from './components/Auth/Login';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import SuperAdminDashboard from './components/Dashboard/SuperAdminDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import UserList from './components/UserManagement/UserList';
import RequireAuth from './components/Auth/RequireAuth';
import AuditLogsPage from './components/Dashboard/AuditLogsPage.js'
import ReportsPage from './components/Dashboard/ReportsPage.js'
import UserVerificationPage from './components/Dashboard/UserVerification.js';

function App() {
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
      <SecurityProvider enableWatermark={false}>
        <Router>
          <Routes>
            {/* Login Route - No Layout */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes - With Dashboard Layout */}
            <Route path="/*" element={
              <RequireAuth>
                <DashboardLayout>
                  <Routes>
                    {/* Dashboard Home */}
                    <Route path="/" element={<RoleBasedDashboard />} />
                    
                    {/* User Management - Admin & SuperAdmin only */}
                    <Route 
                      path="/users" 
                      element={
                        <RequireAuth allowedRoles={['admin', 'superadmin']}>
                          <UserList />
                        </RequireAuth>
                      } 
                    />
                    {/* User Verification - Admin & SuperAdmin only */}
                    <Route 
                      path="/audit-logs" 
                      element={
                        <RequireAuth allowedRoles={['admin', 'superadmin']}>
                          <AuditLogsPage />
                        </RequireAuth>
                      } 
                    />
                    
                    {/* User Verification - Admin & SuperAdmin only */}
                    <Route 
                      path="/user-verification" 
                      element={
                        <RequireAuth allowedRoles={['admin', 'superadmin']}>
                          <UserVerificationPage />
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Backward compatibility for old admins route */}
                    <Route 
                      path="/admins" 
                      element={
                        <RequireAuth allowedRoles={['admin', 'superadmin']}>
                          <UserVerificationPage />
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Reports - All authenticated users */}
                    <Route 
                      path="/reports" 
                      element={
                        <RequireAuth allowedRoles={['superadmin', 'admin', 'user']}>
                          <ReportsPage />
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Profile - All authenticated users */}
                    <Route 
                      path="/profile" 
                      element={
                        <RequireAuth>
                          <div>Profile Page - Coming Soon</div>
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Audit Logs - SuperAdmin only */}
                    <Route 
                      path="/audit" 
                      element={
                        <RequireAuth allowedRoles={['superadmin']}>
                          <AuditLogsPage />
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Settings - All authenticated users */}
                    <Route 
                      path="/settings" 
                      element={
                        <RequireAuth>
                          <div>Settings Page - Coming Soon</div>
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Catch all - redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </DashboardLayout>
              </RequireAuth>
            } />
          </Routes>
        </Router>
      </SecurityProvider>
    </AuthProvider>
  );
}

export default App;