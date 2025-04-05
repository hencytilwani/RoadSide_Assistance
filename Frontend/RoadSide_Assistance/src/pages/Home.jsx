import React from "react";
import QuickAssistance from "../components/QuickAssistance";
import { FaArrowRight, FaPhoneAlt, FaExclamationTriangle } from "react-icons/fa";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-purple-600 py-12 md:py-16 lg:py-24">
        <main className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between">
          {/* Left side - Text Content */}
          <div className="w-full lg:w-2/5 text-white mb-12 lg:mb-0 px-2 sm:px-4 lg:px-8 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-6">
              Emergency Roadside Assistance at Your Fingertips
            </h1>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">
              Experience instant vehicle breakdown assistance powered by
              cutting-edge AI technology. Our 24/7 service ensures you're
              never stranded, no matter where or when you need help.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center font-medium transition-colors shadow-lg">
                <FaExclamationTriangle className="mr-2" /> EMERGENCY SOS
              </button>
              <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center font-medium transition-colors shadow-lg">
                <FaPhoneAlt className="mr-2" /> Contact Support
              </button>
            </div>
          </div>

          {/* Right side - Phone Image */}
          <div className="w-full lg:w-3/5 flex justify-center">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl">
              {/* Phone SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%" className="drop-shadow-xl">
                {/* Mobile device with roadside assistance app */}
                <defs>
                  {/* Gradient for highlights */}
                  <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8f8f8" />
                    <stop offset="100%" stopColor="#e0e0e0" />
                  </linearGradient>
                  
                  {/* Gradient for app interface */}
                  <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2c3e50" />
                    <stop offset="100%" stopColor="#34495e" />
                  </linearGradient>
                  
                  {/* Pulse animation for SOS button */}
                  <radialGradient id="sosGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#E74C3C" stopOpacity="1" />
                    <stop offset="100%" stopColor="#E74C3C" stopOpacity="0" />
                  </radialGradient>
                </defs>
                
                {/* Smartphone device */}
                <g transform="translate(250, 100)">
                  {/* Phone body */}
                  <rect x="0" y="0" width="300" height="500" rx="30" fill="url(#phoneGradient)" stroke="#d0d0d0" strokeWidth="2" />
                  
                  {/* Phone screen */}
                  <rect x="15" y="40" width="270" height="420" rx="5" fill="url(#screenGradient)" />
                  
                  {/* App Header */}
                  <rect x="15" y="40" width="270" height="60" rx="5" fill="#E74C3C" />
                  <text x="40" y="80" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#fff">RoadAssist Pro</text>
                  <circle cx="250" cy="70" r="15" fill="#fff" opacity="0.2" />
                  <path d="M250,63 L250,77 M243,70 L257,70" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Map View */}
                  <rect x="30" y="115" width="240" height="180" rx="5" fill="#f0f0f0" />
                  
                  {/* Map Elements (roads/locations) */}
                  <path d="M30,200 L270,200" stroke="#ccc" strokeWidth="8" />
                  <path d="M30,200 L270,200" stroke="#fff" strokeWidth="2" strokeDasharray="10 10" />
                  <path d="M150,115 L150,295" stroke="#ccc" strokeWidth="5" />
                  <path d="M150,115 L150,295" stroke="#fff" strokeWidth="1" strokeDasharray="5 5" />
                  
                  {/* Vehicle Location */}
                  <circle cx="150" cy="200" r="12" fill="#3498DB" />
                  <circle cx="150" cy="200" r="6" fill="#fff" />
                  
                  {/* Animated assistance provider approaching */}
                  <circle cx="210" cy="160" r="10" fill="#E74C3C">
                    <animate attributeName="cy" values="160;190;160" dur="4s" repeatCount="indefinite" />
                  </circle>
                  
                  {/* SOS Button */}
                  <g transform="translate(150, 350)">
                    <circle cx="0" cy="0" r="45" fill="#E74C3C" />
                    <circle cx="0" cy="0" r="55" fill="url(#sosGlow)" opacity="0.6">
                      <animate attributeName="r" values="45;60;45" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="0" y="5" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">SOS</text>
                  </g>
                  
                  {/* Bottom Navigation */}
                  <rect x="15" y="420" width="270" height="40" fill="#222" />
                  
                  {/* Nav Icons */}
                  <circle cx="60" cy="440" r="15" fill="#444" />
                  <circle cx="150" cy="440" r="15" fill="#444" />
                  <circle cx="240" cy="440" r="15" fill="#444" />
                  
                  {/* Home Button */}
                  <circle cx="150" cy="480" r="20" fill="#333" stroke="#555" strokeWidth="1" />
                </g>
                
                {/* Connection lines between services */}
                <g opacity="0.6">
                  <path d="M400,300 C450,250 500,350 550,300" stroke="#E74C3C" strokeWidth="3" fill="none" strokeDasharray="5,5">
                    <animate attributeName="strokeDashoffset" values="20;0" dur="2s" repeatCount="indefinite" />
                  </path>
                </g>
                
                {/* Service Elements - Tow Truck Icon */}
                <g transform="translate(580, 280) scale(0.7)" opacity="0.9">
                  <rect x="0" y="20" width="100" height="40" rx="5" fill="#E74C3C" />
                  <rect x="90" y="0" width="50" height="60" rx="5" fill="#E74C3C" />
                  <rect x="0" y="50" width="150" height="10" rx="5" fill="#333" />
                  <circle cx="30" cy="60" r="15" fill="#333" />
                  <circle cx="30" cy="60" r="5" fill="#666" />
                  <circle cx="110" cy="60" r="15" fill="#333" />
                  <circle cx="110" cy="60" r="5" fill="#666" />
                </g>
              </svg>
            </div>
          </div>
        </main>
      </div>
      
      {/* Features Section */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">Why Choose RoadAssist Pro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our team is available around the clock to assist you with any roadside emergency.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">GPS Tracking</h3>
              <p className="text-gray-600">Real-time tracking allows our technicians to find you quickly and efficiently.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rapid Response</h3>
              <p className="text-gray-600">Average response time of less than 30 minutes to get you back on the road.</p>
            </div>
          </div>
        </div>
      </section>
      
      <QuickAssistance />
    </div>
  );
};

export default HomePage;