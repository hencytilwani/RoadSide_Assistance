import React from "react";
import { FaCarBattery, FaCogs, FaOilCan, FaCarCrash } from "react-icons/fa";
import { MdWarning, MdDirectionsCar } from "react-icons/md";

const VehicleHealth = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-auto flex justify-center">
      <div className="w-full max-w-7xl"> {/* Centered Container with Max Width */}
  
        {/* Vehicle Health Section */}
        <div className="mt-8 bg-gray-200 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-700">
              <span className="text-red-500">❤️</span> Vehicle Health & Predictive Maintenance
            </h2>
            <button className="flex items-center gap-2 bg-white border px-4 py-2 rounded shadow">
              <MdDirectionsCar className="text-red-500" /> Change Vehicle
            </button>
          </div>
  
          {/* Main Widget - Vehicle Health Score */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Circular Score */}
            <div className="w-110 bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-gray-200 stroke-current" cx="50" cy="50" r="40" strokeWidth="8" fill="none" />
                  <circle className="text-red-500 stroke-current" cx="50" cy="50" r="40" strokeWidth="8" fill="none"
                    strokeDasharray="250" strokeDashoffset="50" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-red-500">85%</span>
              </div>
              <p className="text-lg font-semibold mt-4">Vehicle Health Score</p>
              <p className="text-gray-500 text-sm">Your vehicle is in good condition</p>
            </div>
  
            {/* Condition Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 shadow rounded flex items-center gap-3">
                <FaCarBattery className="text-green-500 text-3xl" />
                <div>
                  <p className="font-semibold">Battery</p>
                  <p className="text-sm text-gray-500">Good condition (95%)</p>
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded flex items-center gap-3">
                <FaCogs className="text-green-500 text-3xl" />
                <div>
                  <p className="font-semibold">Engine</p>
                  <p className="text-sm text-gray-500">Good condition (90%)</p>
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded flex items-center gap-3">
                <FaOilCan className="text-yellow-500 text-3xl" />
                <div>
                  <p className="font-semibold">Oil</p>
                  <p className="text-sm text-gray-500">Due for change in 500 miles</p>
                </div>
              </div>
              <div className="bg-white p-4 shadow rounded flex items-center gap-3">
                <FaCarCrash className="text-red-500 text-3xl" />
                <div>
                  <p className="font-semibold">Front Tires</p>
                  <p className="text-sm text-gray-500">Low tread depth (20%)</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Maintenance Warning Banner */}
          <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 p-4 flex items-center gap-3 shadow-md">
            <MdWarning className="text-yellow-500 text-2xl" />
            <div>
              <p className="font-semibold">Upcoming Maintenance Needed</p>
              <p className="text-sm text-gray-700">Based on your driving patterns, you'll need an oil change in the next 500 miles or 2 weeks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}  

export default VehicleHealth;
