export const users = [
    {
      id: 1,
      name: "Super Admin",
      email: "super@admin.com",
      password: "superadmin123",
      role: "superadmin",
      status: "active",
      created: "2023-01-01"
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      status: "active",
      created: "2023-02-15"
    },
    {
      id: 3,
      name: "Regular User",
      email: "user@example.com",
      password: "user123",
      role: "user",
      status: "active",
      created: "2023-03-20"
    },
    {
      id: 4,
      name: "John Doe",
      email: "john@example.com",
      password: "john123",
      role: "user",
      status: "inactive",
      created: "2023-04-10"
    },
    {
      id: 5,
      name: "Jane Smith",
      email: "jane@example.com",
      password: "jane123",
      role: "admin",
      status: "active",
      created: "2023-05-05"
    }
  ];
  
  export const dashboardStats = {
    totalUsers: 42,
    activeUsers: 38,
    newUsersToday: 3,
    totalAdmins: 5,
    recentLoginCount: 12,
    pendingApprovals: 4
  };
  
  export const recentActivity = [
    { id: 1, user: "Jane Smith", action: "User login", timestamp: "2023-10-15 08:23:00" },
    { id: 2, user: "Admin User", action: "Changed role for 'Mark Johnson'", timestamp: "2023-10-14 16:45:00" },
    { id: 3, user: "Super Admin", action: "Added new user 'Sarah Williams'", timestamp: "2023-10-14 14:30:00" },
    { id: 4, user: "John Doe", action: "Updated profile", timestamp: "2023-10-14 11:15:00" },
    { id: 5, user: "Super Admin", action: "System backup", timestamp: "2023-10-13 23:00:00" }
  ];
  
  export const roles = [
    { id: 1, name: "superadmin", label: "Super Admin", permissions: ["all"] },
    { id: 2, name: "admin", label: "Admin", permissions: ["manage_users", "view_reports", "edit_content"] },
    { id: 3, name: "user", label: "User", permissions: ["view_content", "edit_profile"] }
  ];
  