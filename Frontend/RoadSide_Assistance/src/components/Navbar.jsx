import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate(); // ✅ Initialize useNavigate
  
  // Debug authentication state
  useEffect(() => {
    console.log("Auth state in Navbar:", isAuthenticated);
  }, [isAuthenticated]);

  // Function to handle navigation (redirect to login if not authenticated)
  const handleNavClick = (e, path) => {
    e.preventDefault(); // Prevent default link behavior

    if (!isAuthenticated && path !== "/") {
      // Redirect to login page if not authenticated and clicked on non-home page
      navigate("/login");
    } else {
      // Navigate to the desired path if authenticated or it's the home page
      navigate(path);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center w-full">
      {/* Logo */}
      <h1 className="text-red-500 text-2xl font-bold">RoadAssist Pro</h1>

      {/* Desktop Navigation - Centered - hide below 980px */}
      <nav className="hidden lg:flex flex-1 justify-center">
        <ul className="flex space-x-6 text-gray-700">
          <li>
            <Link to="/" className="flex items-center hover:text-red-500">
              <span className="mr-1">🏠</span> Home
            </Link>
          </li>
          <li>
            <Link to="/ai-diagnosis" className="flex items-center hover:text-red-500">
              <span className="mr-1">🔍</span> AI Diagnosis
            </Link>
          </li>
          <li>
            <Link to="/ar-guide" className="flex items-center hover:text-red-500">
              <span className="mr-1">🥽</span> AR Guide
            </Link>
          </li>
          <li>
            <Link to="/maintenance" className="flex items-center hover:text-red-500">
              <span className="mr-1">🔧</span> Maintenance
            </Link>
          </li>
          <li>
            <Link to="/fleet" className="flex items-center hover:text-red-500">
              <span className="mr-1">🚗</span> Fleet
            </Link>
          </li>
          <li className="relative group">
            <button className="flex items-center hover:text-red-500 focus:outline-none">
              <span className="mr-1">⋯</span> More <span className="ml-1">▼</span>
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-md py-2 mt-1 rounded-md w-36 z-10">
              <Link to="/roadside-guardian" className="block px-4 py-2 hover:bg-gray-100">Roadside Guardian</Link>
              <Link to="/vehicle-health" className="block px-4 py-2 hover:bg-gray-100">Vehicle Health</Link>
              <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
            </div>
          </li>
        </ul>
      </nav>

      {/* Auth/Account Buttons */}
      <div className="ml-auto">
        {isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <Link 
              to="/account" 
              className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-600 transition-colors"
            >
              My Account
            </Link>
            <button
              onClick={handleLogout}
              className="border border-red-500 text-red-500 px-3 py-2 rounded text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Login
          </Link>
        )}
      </div>

      {/* Hamburger Menu Button (Mobile) - show below 980px */}
      <button
        className="lg:hidden text-gray-700 focus:outline-none ml-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md lg:hidden z-20">
          <ul className="flex flex-col text-center py-2 text-gray-700">
            <li>
              <Link to="/" className="block py-2 hover:bg-gray-100">
                <span className="mr-1">🏠</span> Home
              </Link>
            </li>
            <li>
              <Link to="/ai-diagnosis" className="block py-2 hover:bg-gray-100">
                <span className="mr-1">🔍</span> AI Diagnosis
              </Link>
            </li>
            <li>
              <Link to="/ar-guide" className="block py-2 hover:bg-gray-100">
                <span className="mr-1">🥽</span> AR Guide
              </Link>
            </li>
            <li>
              <Link to="/maintenance" className="block py-2 hover:bg-gray-100">
                <span className="mr-1">🔧</span> Maintenance
              </Link>
            </li>
            <li>
              <Link to="/fleet" className="block py-2 hover:bg-gray-100">
                <span className="mr-1">🚗</span> Fleet
              </Link>
            </li>
            <li>
              <Link to="/roadside-guardian" className="block py-2 hover:bg-gray-100">
                <span className="mr-1">⋯</span> More
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/account" className="block py-2 bg-red-500 text-white mx-4 mt-2 rounded">
                    My Account
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full py-2 border border-red-500 text-red-500 mx-4 mb-2 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="block py-2 bg-red-500 text-white mx-4 my-2 rounded">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
