import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import StatCard from '../components/admin/StatCard';
import ServiceUsageChart from '../components/admin/ServiceUsageChart';
import RecentActivities from '../components/admin/RecentActivities';
import ServiceRequestsTable from '../components/admin/ServiceRequestsTable';
import { FaUserCog } from 'react-icons/fa';
// Import mock API for testing
import * as adminAPI from '../services/mockAPI';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: '0',
    activeServices: '0',
    pendingRequests: '0',
    revenue: '$0',
    userChange: '0%',
    serviceChange: '0%',
    requestChange: '0%',
    revenueChange: '0%'
  });
  const [serviceUsageData, setServiceUsageData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle service request status change
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const updatedRequest = await adminAPI.updateServiceRequest(requestId, { status: newStatus });
      // Update the service requests list
      setServiceRequests(prevRequests => 
        prevRequests.map(req => req.id === requestId ? { ...req, status: newStatus } : req)
      );
      
      // Refresh recent activities as the status change would create a new activity
      const activities = await adminAPI.getRecentActivities();
      setRecentActivities(activities);
    } catch (err) {
      console.error('Error updating service request:', err);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch dashboard statistics
        const statsData = await adminAPI.getDashboardStats();
        if (statsData) {
          setDashboardData({
            totalUsers: statsData.totalUsers.toLocaleString(),
            activeServices: statsData.activeServices.toString(),
            pendingRequests: statsData.pendingRequests.toString(),
            revenue: `$${statsData.revenue.toLocaleString()}`,
            userChange: `${statsData.userChange}%`,
            serviceChange: `${statsData.serviceChange}%`,
            requestChange: `${statsData.requestChange}%`,
            revenueChange: `${statsData.revenueChange}%`
          });
        }

        // Fetch service usage data for chart
        const usageData = await adminAPI.getServiceUsageData();
        if (usageData) {
          setServiceUsageData(usageData);
        }

        // Fetch recent activities
        const activities = await adminAPI.getRecentActivities();
        if (activities) {
          setRecentActivities(activities);
        }

        // Fetch service requests
        const requests = await adminAPI.getServiceRequests(1, 10);
        if (requests && requests.data) {
          setServiceRequests(requests.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // If loading, show a loading indicator
  if (loading && !dashboardData.totalUsers) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-0'} pt-0 lg:pt-0`}>
          <div className="lg:p-6 p-4 mt-16 lg:mt-0">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there's an error, show error message
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-0'} pt-0 lg:pt-0`}>
          <div className="lg:p-6 p-4 mt-16 lg:mt-0">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render dashboard with data
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-0'} pt-0 lg:pt-0`}>
        {/* Header - Only visible on desktop */}
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center hidden lg:flex">
          <h1 className="text-2xl font-bold text-gray-800 ml-8">Dashboard Overview</h1>
          <div className="flex items-center">
            <button className="flex items-center bg-gray-200 hover:bg-gray-300 rounded-md px-3 py-2 text-sm">
              <FaUserCog className="mr-2" />
              <span>Admin</span>
              <span className="ml-2">▼</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="lg:p-6 p-4 mt-16 lg:mt-0 pb-16 lg:pb-6">
          {/* Mobile Header */}
          <div className="lg:hidden mb-4">
            <h1 className="text-xl font-bold text-gray-800">Dashboard Overview</h1>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            <StatCard
              title="Total Users"
              value={dashboardData.totalUsers}
              change={dashboardData.userChange}
              color="blue"
            />
            <StatCard
              title="Active Services"
              value={dashboardData.activeServices}
              change={dashboardData.serviceChange}
              color="green"
            />
            <StatCard
              title="Pending Requests"
              value={dashboardData.pendingRequests}
              change={dashboardData.requestChange}
              color="yellow"
            />
            <StatCard
              title="Revenue"
              value={dashboardData.revenue}
              change={dashboardData.revenueChange}
              color="cyan"
            />
          </div>

          {/* Charts and Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <ServiceUsageChart data={serviceUsageData} />
            </div>
            <div>
              <RecentActivities activities={recentActivities} />
            </div>
          </div>

          {/* Service Requests Table */}
          <div>
            <ServiceRequestsTable 
              requests={serviceRequests}
              onStatusChange={handleStatusChange} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 