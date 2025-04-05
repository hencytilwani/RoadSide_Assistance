<<<<<<< HEAD
import { FaTools, FaGasPump, FaCarBattery, FaTruck } from "react-icons/fa";

const services = [
  {
    icon: <FaTools size={40} className="text-red-500" />, 
=======
import { FaTools, FaGasPump, FaCarBattery, FaTruck, FaArrowRight } from "react-icons/fa";

const services = [
  {
    icon: <FaTools size={32} className="text-red-500" />, 
>>>>>>> Rushita
    title: "Mechanical Help",
    description: "Expert assistance for mechanical failures and breakdowns on the road.",
    actionText: "Get Help",
  },
  {
<<<<<<< HEAD
    icon: <FaGasPump size={40} className="text-red-500" />, 
=======
    icon: <FaGasPump size={32} className="text-red-500" />, 
>>>>>>> Rushita
    title: "Fuel Delivery",
    description: "Emergency fuel delivery when you run out of gas on the road.",
    actionText: "Request Fuel",
  },
  {
<<<<<<< HEAD
    icon: <FaCarBattery size={40} className="text-red-500" />, 
=======
    icon: <FaCarBattery size={32} className="text-red-500" />, 
>>>>>>> Rushita
    title: "Battery Service",
    description: "Jump start or battery replacement for your vehicle.",
    actionText: "Jump Start",
  },
  {
<<<<<<< HEAD
    icon: <FaTruck size={40} className="text-red-500" />, 
=======
    icon: <FaTruck size={32} className="text-red-500" />, 
>>>>>>> Rushita
    title: "Towing",
    description: "Professional towing service to the nearest repair facility.",
    actionText: "Request Tow",
  },
];

const QuickAssistance = () => {
  return (
<<<<<<< HEAD
    <section className="py-12 px-4 md:px-12 bg-white container-fluid">
      <h2 className="text-5xl font-bold text-gray-900 mb-6 border-l-4 border-red-500 pl-3 ml-50 mr-50">Quick Assistance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-50 mr-50">
        {services.map((service, index) => (
          <div key={index} className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
            <p className="text-gray-600 mt-2">{service.description}</p>
            <button className="mt-4 text-red-500 font-semibold flex items-center gap-1 hover:underline">
              {service.actionText} →
            </button>
          </div>
        ))}
=======
    <section className="py-10 sm:py-12 px-4 sm:px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-l-4 border-red-500 pl-3">
          Quick Assistance
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Our roadside assistance services are available 24/7 to help you in any emergency situation. 
          Select the service you need below and help will be on the way.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden border border-gray-100"
            >
              <div className="p-5">
                <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <button className="text-red-500 font-medium flex items-center gap-1 hover:text-red-600 transition-colors group">
                  {service.actionText}
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="mt-12 bg-gray-50 p-6 sm:p-8 rounded-lg border border-gray-200 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">Need immediate help?</h3>
            <p className="text-gray-600">Our support team is ready to assist you 24/7</p>
          </div>
          <button className="mt-4 sm:mt-0 inline-block bg-red-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">
            Call Emergency Support
          </button>
        </div>
>>>>>>> Rushita
      </div>
    </section>
  );
};

export default QuickAssistance;