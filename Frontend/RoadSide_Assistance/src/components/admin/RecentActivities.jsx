import React from 'react';
import './admin.css';

const RecentActivities = ({ activities = [] }) => {
  // Use default data if none provided
  const displayActivities = activities.length > 0 ? activities : [
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
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {displayActivities.map((activity) => (
          <div key={activity.id} className="border-b border-gray-100 pb-3">
            <div className="flex justify-between">
              <h4 className="font-medium">{activity.type}</h4>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
            <p className="text-gray-600 mt-1">{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities; 