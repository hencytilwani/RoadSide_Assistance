import React from 'react';
import './admin.css';

const ServiceRequestsTable = ({ requests = [], onStatusChange = () => {} }) => {
  // Use default data if none provided
  const displayRequests = requests.length > 0 ? requests : [
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
  ];

  const getStatusBadge = (status) => {
    if (status === "Pending") {
      return <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-md">Pending</span>;
    } else if (status === "Completed") {
      return <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-md">Completed</span>;
    } else {
      return <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-md">{status}</span>;
    }
  };

  const handleCompleteRequest = (requestId) => {
    onStatusChange(requestId, "Completed");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Recent Service Requests</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{request.id}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{request.user}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{request.type}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{request.date}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded mr-2 text-xs">View</button>
                  {request.status === "Pending" && (
                    <button 
                      className="px-3 py-1 bg-green-500 text-white rounded text-xs"
                      onClick={() => handleCompleteRequest(request.id)}
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceRequestsTable; 