import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
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
              
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
