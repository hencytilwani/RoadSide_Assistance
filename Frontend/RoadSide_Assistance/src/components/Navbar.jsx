<<<<<<< HEAD
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
=======
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
>>>>>>> Rushita

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
<<<<<<< HEAD
  const navigate = useNavigate();

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (!isAuthenticated && path !== "/") {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-red-600 text-3xl font-extrabold tracking-wide">
          RoadAssist <span className="text-gray-800">Pro</span>
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { name: "Home", path: "/" },
            { name: "AI Diagnosis", path: "/ai-diagnosis" },
            { name: "AR Guide", path: "/ar-guide" },
            { name: "Maintenance", path: "/maintenance" },
            { name: "Fleet", path: "/fleet" },
            { name: "More", path: "/roadside-guardian" },
          ].map(({ name, path }) => (
            <a
              key={name}
              href={path}
              onClick={(e) => handleNavClick(e, path)}
              className="text-gray-700 text-lg font-medium hover:text-red-500 hover:underline underline-offset-4 transition duration-200"
            >
              {name}
            </a>
          ))}

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="border border-red-500 text-red-500 px-5 py-2 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition duration-200 shadow-sm"
              >
              Login
            </Link>
          )}
        </nav>

        {/* Account Button */}
        {isAuthenticated && (
          <button className="hidden md:block bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-gray-700 transition duration-200">
            My Account
          </button>
        )}

        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg mt-4 rounded-md">
          <ul className="flex flex-col items-center space-y-4 py-4 text-gray-700 text-lg font-medium">
            {[
              { name: "Home", path: "/" },
              { name: "AI Diagnosis", path: "/ai-diagnosis" },
              { name: "AR Guide", path: "/ar-guide" },
              { name: "Maintenance", path: "/maintenance" },
              { name: "Fleet", path: "/fleet" },
              { name: "More", path: "/roadside-guardian" },
            ].map(({ name, path }) => (
              <li key={name}>
                <a
                  href={path}
                  onClick={(e) => {
                    setIsOpen(false);
                    handleNavClick(e, path);
                  }}
                  className="block py-2 hover:text-red-500 transition duration-200"
                >
                  {name}
                </a>
              </li>
            ))}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hover:text-red-500 transition"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              
=======
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
>>>>>>> Rushita
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
