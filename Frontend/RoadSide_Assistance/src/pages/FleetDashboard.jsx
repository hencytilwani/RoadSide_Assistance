import React from "react";
import { FaCar, FaTools, FaExclamationTriangle, FaPlus } from "react-icons/fa";
import { MdSearch } from "react-icons/md";

const FleetDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-6xl p-6"> {/* Ensuring left-right spacing */}

        {/* Dashboard Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Fleet Management Dashboard</h2>
            <p className="text-gray-600">Manage your fleet vehicles and track their status</p>
          </div>
          {/* Add Vehicle Button */}
          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600">
            <FaPlus /> Add Vehicle
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-red-500">24</h3>
            <p className="text-gray-600">Total Vehicles</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-red-500">18</h3>
            <p className="text-gray-600">Active Vehicles</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-red-500">4</h3>
            <p className="text-gray-600">Maintenance Due</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-3xl font-bold text-red-500">2</h3>
            <p className="text-gray-600">Issues Reported</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mt-6">
          <button className="bg-red-500 text-white px-6 py-2 rounded-lg">All Vehicles</button>
          <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg">Active</button>
          <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg">Maintenance</button>
          <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg">Issues</button>
        </div>

        {/* Fleet Overview Table */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-700">Fleet Overview</h3>
            <div className="flex items-center bg-gray-100 p-2 rounded-lg">
              <MdSearch className="text-gray-500" />
              <input type="text" placeholder="Search vehicles..." className="bg-transparent focus:outline-none ml-2" />
            </div>
          </div>

          {/* Table */}
          <div className="mt-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-gray-200">
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Driver</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Update</th>
                  <th className="p-3">Health Score</th>
                  <th className="p-3">Next Service</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Vehicle 1 */}
                <tr className="border-t">
                  <td className="p-3 flex items-center gap-2">
                    <FaCar className="text-red-500" /> <span>Delivery Truck #1</span>
                  </td>
                  <td className="p-3">John Doe</td>
                  <td className="p-3">
                    <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full">Active</span>
                  </td>
                  <td className="p-3">Today, 10:45 AM</td>
                  <td className="p-3 text-green-500 font-bold">92%</td>
                  <td className="p-3">Apr 15, 2023</td>
                  <td className="p-3">
                    <button className="bg-gray-200 px-4 py-2 rounded">Actions</button>
                  </td>
                </tr>

                {/* Vehicle 2 */}
                <tr className="border-t">
                  <td className="p-3 flex items-center gap-2">
                    <FaTools className="text-orange-500" /> <span>Sedan #5</span>
                  </td>
                  <td className="p-3">Jane Smith</td>
                  <td className="p-3">
                    <span className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full">Maintenance</span>
                  </td>
                  <td className="p-3">Yesterday, 3:20 PM</td>
                  <td className="p-3 text-yellow-500 font-bold">75%</td>
                  <td className="p-3">In Progress</td>
                  <td className="p-3">
                    <button className="bg-gray-200 px-4 py-2 rounded">Actions</button>
                  </td>
                </tr>

                {/* Vehicle 3 */}
                <tr className="border-t">
                  <td className="p-3 flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-500" /> <span>Pickup Truck #3</span>
                  </td>
                  <td className="p-3">Robert Johnson</td>
                  <td className="p-3">
                    <span className="bg-red-200 text-red-700 px-3 py-1 rounded-full">Issue Reported</span>
                  </td>
                  <td className="p-3">Today, 8:15 AM</td>
                  <td className="p-3 text-red-500 font-bold">68%</td>
                  <td className="p-3">Urgent</td>
                  <td className="p-3">
                    <button className="bg-gray-200 px-4 py-2 rounded">Actions</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FleetDashboard;
