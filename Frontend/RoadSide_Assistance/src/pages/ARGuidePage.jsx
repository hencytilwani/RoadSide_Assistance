import React from "react";
import { FaVrCardboard, FaLightbulb, FaExpand, FaCamera, FaWrench, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ARGuidePage = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="flex items-center space-x-3 mb-6">
          <FaVrCardboard className="text-orange-500 text-3xl" />
          <h2 className="text-2xl font-semibold text-gray-800">Augmented Reality Repair Guide</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* AR Viewport */}
          <div className="flex-1 bg-black shadow-md rounded-lg p-6 relative h-120">
            <div className="flex flex-col items-center justify-center h-64 rounded-lg">
              <FaCamera className="text-gray-500 text-4xl mb-2 mt-25" />
              <p className="text-gray-600">Camera view will appear here</p>
            </div>
            <div className="items-center justify-center absolute bottom-4 inset-x-0 bottom-0 left-4 flex space-x-4">
              <button className="p-2 bg-gray-200 rounded-full shadow-md" title="Toggle light">
                <FaLightbulb className="text-gray-600 text-lg" />
              </button>
              <button className="p-2 bg-gray-200 rounded-full shadow-md" title="Fullscreen">
                <FaExpand className="text-gray-600 text-lg" />
              </button>
              <button className="p-2 bg-gray-200 rounded-full shadow-md" title="Take photo">
                <FaCamera className="text-gray-600 text-lg" />
              </button>
            </div>
          </div>

          {/* Steps Section */}
          <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FaWrench className="text-orange-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-800">Step 2: Loosen Lug Nuts</h3>
            </div>
            <hr />
            <br/>
            <div className="space-y-4">
              {["Locate Lug Wrench", "Position Wrench", "Turn Counterclockwise", "Safety Check"].map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white font-semibold rounded-full">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-medium">{step}</h4>
                    <p className="text-gray-600 text-sm">Detailed instruction for {step.toLowerCase()}.</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button className="flex items-center px-4 py-2 bg-gray-200 rounded-lg text-gray-700 shadow-md">
                <FaArrowLeft className="mr-2" /> Previous Step
              </button>
              <button className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md">
                Next Step <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Step Progress */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex space-x-2 mb-2">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full ${index < 2 ? "bg-orange-500" : "bg-gray-300"}`}
              ></span>
            ))}
          </div>
          <p className="text-gray-700">Step 2 of 5</p>
        </div>
      </div>
    </section>
  );
};

export default ARGuidePage;