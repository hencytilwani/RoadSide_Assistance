import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaCogs, 
  FaUsers, 
  FaChartBar, 
  FaWrench, 
  FaAngleLeft,
  FaAngleRight,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import './admin/admin.css';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { to: '/admin/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/admin/services', icon: <FaWrench />, text: 'Services' },
    { to: '/admin/users', icon: <FaUsers />, text: 'Users' },
    { to: '/admin/analytics', icon: <FaChartBar />, text: 'Analytics' },
    { to: '/admin/settings', icon: <FaCogs />, text: 'Settings' }
  ];

  return (
    <>
      {/* Desktop hamburger menu - only visible when sidebar is closed */}
      {!isOpen && (
        <button 
          onClick={toggleSidebar}
          className="hidden lg:flex fixed top-4 left-4 z-30 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded shadow-lg"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Desktop Sidebar Toggle (circle button) - can be hidden if not needed */}
      <button 
        onClick={toggleSidebar}
        className="hidden lg:flex fixed bottom-4 z-30 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full shadow-lg"
        style={{ 
          left: isOpen ? '240px' : '48px',
          transition: 'left 0.3s ease-in-out'
        }}
      >
        {isOpen ? <FaAngleLeft size={16} /> : <FaAngleRight size={16} />}
      </button>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-gray-800 text-white z-30 shadow-md">
        <div className="flex justify-around items-center py-2 px-1">
          {navItems.map((item, index) => (
            <Link 
              key={index}
              to={item.to} 
              className="flex flex-col items-center py-1 px-2"
            >
              <div className="text-xl">{item.icon}</div>
              <span className="text-xs mt-1">{item.text}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sidebar for desktop - always show text when open */}
      <div 
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white z-20 transition-all duration-300 shadow-xl lg:block hidden
                   ${isOpen ? 'w-60' : 'w-0'} overflow-hidden`}
      >
        <div className="p-5 border-b border-gray-700 flex justify-between items-center mt-10">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button 
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="mt-5">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.to} 
                  className="flex items-center px-5 py-3 hover:bg-gray-700 transition-colors"
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar; 