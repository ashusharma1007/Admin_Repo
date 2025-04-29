export const getUserRoleLabel = (role) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'user':
        return 'User';
      default:
        return 'Unknown';
    }
  };
  