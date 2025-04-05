import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './admin.css';

const StatCard = ({ title, value, change, color }) => {
  const isPositive = !change.includes('-');
  const bgColorClass = `bg-${color}-500`;
  
  return (
    <div className={`${bgColorClass} rounded-lg overflow-hidden shadow-md text-white`}>
      <div className="p-6">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <div className="flex items-center mt-3 text-sm">
          {isPositive ? (
            <FaArrowUp className="mr-1" />
          ) : (
            <FaArrowDown className="mr-1" />
          )}
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 