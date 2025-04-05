import React from "react";
import { FaRobot, FaUser } from "react-icons/fa";

const AIVehicleDiagnosis = () => {
  return (
    <section className="bg-gray-100 py-16 px-6 min-h-screen flex justify-center">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8">
        {/* AI Chat Section */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <div className="bg-gray-800 text-white p-4 rounded-t-lg flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <h3 className="text-lg font-semibold">AI Vehicle Assistant</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <FaRobot className="text-red-500 text-2xl" />
              <div className="bg-gray-100 p-4 rounded-lg w-full">
                <p className="text-gray-700 text-sm">
                  Hello! I'm your AI Vehicle Assistant. I can help diagnose issues with your
                  vehicle. What problem are you experiencing today?
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Car won’t start', 'Check engine light', 'Strange noise', 'Overheating'].map(
                    (issue, index) => (
                      <button
                        key={index}
                        className="bg-white text-gray-700 border px-3 py-1 rounded-full shadow-sm"
                      >
                        {issue}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaUser className="text-gray-600 text-2xl" />
              <div className="bg-red-200 p-4 rounded-lg w-full">
                <p className="text-red-700 text-sm">
                  My car is making a strange rattling noise when I accelerate above 40mph. It
                  seems to be coming from the front passenger side.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t flex items-center mb-0">
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 border rounded-lg p-2"
            />
            <button className="ml-3 text-red-500 text-2xl">
              <FaRobot />
            </button>
          </div>
        </div>

        {/* Diagnosis Summary Section */}
        <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800">Current Diagnosis</h3>
          <div className="bg-gray-100 p-3 rounded-lg mt-3 flex items-center">
            <span className="text-green-500 text-lg mr-2">✔</span>
            <div>
              <p className="text-gray-700 font-semibold">OBD-II Connection</p>
              <p className="text-gray-600 text-sm">Connected to 2019 Toyota Camry</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-gray-700 font-semibold">Diagnosis Steps</h4>
            {[
              "Initial Assessment: Rattling noise from front passenger side",
              "OBD-II Scan: No error codes detected",
              "Visual Inspection: Checking suspension components",
              "Sound Analysis: Analyzing recorded audio",
            ].map((step, index) => (
              <div key={index} className="flex items-start space-x-3 mt-3">
                <span className={`bg-${["green", "blue", "orange", "red"][index]}-500 text-white font-bold w-6 h-6 flex items-center justify-center rounded-full`}>{index + 1}</span>
                <p className="text-gray-700 text-sm">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="text-gray-700 font-semibold">Recommended Actions</h4>
            {[
              "Inspect heat shields for looseness",
              "Check front passenger wheel for loose lug nuts",
            ].map((action, index) => (
              <div key={index} className="flex items-start space-x-3 mt-2">
                <span className="text-green-500 text-lg">✔</span>
                <p className="text-gray-700 text-sm">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIVehicleDiagnosis;
