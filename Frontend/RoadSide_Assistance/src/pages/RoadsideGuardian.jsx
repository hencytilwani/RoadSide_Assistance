import { FaBolt, FaShieldAlt, FaMagic, FaExclamationCircle } from "react-icons/fa";

const RoadsideGuardian = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-100 px-6">
      <div className="w-full max-w-2xl bg-white p-12 rounded-xl shadow-lg text-center border border-gray-200">
        
        {/* Title Section */}
        <h2 className="text-3xl font-bold text-gray-800">
          Your Roadside Guardian Angel
        </h2>
        <p className="text-gray-600 mt-3 text-base leading-relaxed">
          Never face vehicle trouble alone again. Our intelligent assistance network deploys 
          rescue teams within minutes, providing peace of mind wherever your journey takes you.
        </p>

        {/* Instant Rescue Button */}
        <div className="mt-8">
          <button className="bg-red-500 text-white text-base font-semibold py-3 px-8 rounded-full flex items-center justify-center gap-3 mx-auto shadow-lg hover:bg-red-600 transition-all">
            <FaExclamationCircle className="text-lg" />
            Instant Rescue
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 bg-white py-3 px-5 rounded-full shadow-md border border-gray-300">
            <FaBolt className="text-red-500 text-xl" />
            <span className="text-gray-700 text-base font-medium">Lightning Response</span>
          </div>
          <div className="flex items-center gap-2 bg-white py-3 px-5 rounded-full shadow-md border border-gray-300">
            <FaShieldAlt className="text-red-500 text-xl" />
            <span className="text-gray-700 text-base font-medium">Smart Protection</span>
          </div>
          <div className="flex items-center gap-2 bg-white py-3 px-5 rounded-full shadow-md border border-gray-300">
            <FaMagic className="text-red-500 text-xl" />
            <span className="text-gray-700 text-base font-medium">AI-Powered Help</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoadsideGuardian;
