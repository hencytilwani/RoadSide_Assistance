// Mock Data for Admin Dashboard API
const mockData = {
  dashboardStats: {
    totalUsers: 1234,
    activeServices: 89,
    pendingRequests: 23,
    revenue: 12345,
    userChange: 12,
    serviceChange: 8,
    requestChange: -5,
    revenueChange: 15
  },
  
  serviceUsageData: [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 59 },
    { month: 'Mar', value: 80 },
    { month: 'Apr', value: 81 },
    { month: 'May', value: 56 },
    { month: 'Jun', value: 55 }
  ],
  
  recentActivities: [
    {
      id: 1,
      type: "New Service Request",
      description: "Tire replacement requested",
      time: "3 mins ago"
    },
    {
      id: 2,
      type: "User Registration",
      description: "New user registered",
      time: "15 mins ago"
    },
    {
      id: 3,
      type: "Service Completed",
      description: "Battery replacement completed",
      time: "1 hour ago"
    }
  ],
  
  serviceRequests: {
    data: [
      {
        id: "#1234",
        user: "John Doe",
        type: "Tire Replacement",
        status: "Pending",
        date: "2024-03-20"
      },
      {
        id: "#1233",
        user: "Jane Smith",
        type: "Battery Service",
        status: "Completed",
        date: "2024-03-19"
      }
    ],
    page: 1,
    totalPages: 1,
    totalItems: 2
  },
  
  users: {
    data: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "customer",
        createdAt: "2024-03-01"
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "customer",
        createdAt: "2024-03-05"
      },
      {
        id: 3,
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        createdAt: "2024-02-15"
      }
    ],
    page: 1,
    totalPages: 1,
    totalItems: 3
  },
  
  services: {
    data: [
      {
        id: 1,
        name: "Tire Replacement",
        description: "Replace flat or damaged tires",
        price: 120,
        estimatedTime: "1 hour"
      },
      {
        id: 2,
        name: "Battery Jump Start",
        description: "Jump start a dead battery",
        price: 80,
        estimatedTime: "30 minutes"
      },
      {
        id: 3,
        name: "Towing Service",
        description: "Tow vehicle to a repair shop",
        price: 200,
        estimatedTime: "Varies"
      }
    ],
    page: 1,
    totalPages: 1,
    totalItems: 3
  }
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Dashboard stats
export const getDashboardStats = async () => {
  await delay(800);
  return mockData.dashboardStats;
};

// Users API
export const getUsers = async (page = 1, limit = 10) => {
  await delay(800);
  return mockData.users;
};

export const createUser = async (userData) => {
  await delay(800);
  const newUser = {
    id: Math.floor(Math.random() * 1000) + 10,
    ...userData,
    createdAt: new Date().toISOString().split('T')[0]
  };
  mockData.users.data.push(newUser);
  return newUser;
};

export const updateUser = async (userId, userData) => {
  await delay(800);
  const userIndex = mockData.users.data.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  const updatedUser = { ...mockData.users.data[userIndex], ...userData };
  mockData.users.data[userIndex] = updatedUser;
  return updatedUser;
};

export const deleteUser = async (userId) => {
  await delay(800);
  const userIndex = mockData.users.data.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  mockData.users.data.splice(userIndex, 1);
  return { success: true };
};

// Services API
export const getServices = async (page = 1, limit = 10) => {
  await delay(800);
  return mockData.services;
};

export const getServiceRequests = async (page = 1, limit = 10, status = '') => {
  await delay(800);
  if (status) {
    const filteredData = mockData.serviceRequests.data.filter(req => req.status === status);
    return {
      ...mockData.serviceRequests,
      data: filteredData,
      totalItems: filteredData.length
    };
  }
  return mockData.serviceRequests;
};

export const updateServiceRequest = async (requestId, updateData) => {
  await delay(800);
  const requestIndex = mockData.serviceRequests.data.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    throw new Error('Service request not found');
  }
  const updatedRequest = { ...mockData.serviceRequests.data[requestIndex], ...updateData };
  mockData.serviceRequests.data[requestIndex] = updatedRequest;
  
  // If status changed to completed, add to recent activities
  if (updateData.status === 'Completed' && mockData.serviceRequests.data[requestIndex].status !== 'Completed') {
    mockData.recentActivities.unshift({
      id: Math.floor(Math.random() * 1000) + 10,
      type: "Service Completed",
      description: `${updatedRequest.type} completed`,
      time: "Just now"
    });
  }
  
  return updatedRequest;
};

// Analytics API
export const getServiceUsageData = async (period = 'month') => {
  await delay(800);
  return mockData.serviceUsageData;
};

export const getRevenueData = async (period = 'month') => {
  await delay(800);
  return mockData.serviceUsageData.map(item => ({
    month: item.month,
    value: item.value * 150 // Just mock revenue data based on service usage
  }));
};

export const getRecentActivities = async (limit = 5) => {
  await delay(800);
  return mockData.recentActivities.slice(0, limit);
};

export default {
  getDashboardStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getServices,
  getServiceRequests,
  updateServiceRequest,
  getServiceUsageData,
  getRevenueData,
  getRecentActivities,
}; 