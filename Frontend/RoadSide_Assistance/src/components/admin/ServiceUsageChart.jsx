import React from 'react';
import './admin.css';

const ServiceUsageChart = ({ data = [] }) => {
  // Use default data if none provided
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 59 },
    { month: 'Mar', value: 80 },
    { month: 'Apr', value: 81 },
    { month: 'May', value: 56 },
    { month: 'Jun', value: 55 }
  ];
  
  const months = chartData.map(item => item.month);
  const values = chartData.map(item => item.value);
  
  const maxValue = Math.max(...values);
  const chartHeight = 250;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Service Usage Trends</h3>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-teal-400 mr-1 rounded-sm"></div>
          <span className="text-xs text-gray-600">Service Requests</span>
        </div>
      </div>
      
      <div className="relative pt-2 pb-10 px-4 h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-2">
          {[85, 80, 75, 70, 65, 60, 55].map((value, i) => (
            <span key={i} className="block">
              {value}
            </span>
          ))}
        </div>
        
        {/* Chart area */}
        <div className="ml-8 h-full relative border-b border-l border-gray-300">
          {/* Grid lines */}
          <div className="absolute left-0 top-0 w-full h-full">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="absolute w-full border-t border-gray-100"
                style={{ top: `${i * (100/6)}%` }}
              ></div>
            ))}
          </div>
          
          {/* Chart line */}
          <div className="absolute left-0 top-0 w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 600 250" preserveAspectRatio="none">
              <path
                d={values.map((value, index) => {
                  const x = 50 + index * (500 / (values.length - 1));
                  const y = chartHeight - (value / maxValue * chartHeight);
                  return `${index === 0 ? 'M' : 'L'}${x},${y}`;
                }).join(' ')}
                className="chart-line"
              />
            </svg>
          </div>
          
          {/* X-axis with months */}
          <div className="absolute left-0 bottom-0 w-full flex justify-between text-xs text-gray-500 translate-y-6">
            {months.map((month, index) => (
              <div 
                key={index} 
                className="absolute text-center"
                style={{ 
                  left: `${index * (100/(months.length-1))}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {month}
              </div>
            ))}
          </div>
          
          {/* Data points */}
          {values.map((value, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-teal-400 rounded-full shadow-md"
              style={{
                left: `${index * (100/(values.length-1))}%`,
                bottom: `${(value / maxValue) * 100}%`,
                transform: 'translate(-50%, 50%)'
              }}
              title={`${months[index]}: ${value}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceUsageChart; 