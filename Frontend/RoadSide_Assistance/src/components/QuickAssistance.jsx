import { FaTools, FaGasPump, FaCarBattery, FaTruck } from "react-icons/fa";

const services = [
  {
    icon: <FaTools size={40} className="text-red-500" />, 
    title: "Mechanical Help",
    description: "Expert assistance for mechanical failures and breakdowns on the road.",
    actionText: "Get Help",
  },
  {
    icon: <FaGasPump size={40} className="text-red-500" />, 
    title: "Fuel Delivery",
    description: "Emergency fuel delivery when you run out of gas on the road.",
    actionText: "Request Fuel",
  },
  {
    icon: <FaCarBattery size={40} className="text-red-500" />, 
    title: "Battery Service",
    description: "Jump start or battery replacement for your vehicle.",
    actionText: "Jump Start",
  },
  {
    icon: <FaTruck size={40} className="text-red-500" />, 
    title: "Towing",
    description: "Professional towing service to the nearest repair facility.",
    actionText: "Request Tow",
  },
];

const QuickAssistance = () => {
  return (
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
      </div>
    </section>
  );
};

export default QuickAssistance;