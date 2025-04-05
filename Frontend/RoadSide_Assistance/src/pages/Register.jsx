import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    address: "",
    date_of_birth: "",
    emergency_contacts: [{ name: "", phone_number: "", relationship: "", is_primary: true }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmergencyChange = (index, field, value) => {
    const updatedContacts = [...formData.emergency_contacts];
    updatedContacts[index][field] = value;
    setFormData((prev) => ({ ...prev, emergency_contacts: updatedContacts }));
  };

  const addEmergencyContact = () => {
    if (formData.emergency_contacts.length < 3) {
      setFormData((prev) => ({
        ...prev,
        emergency_contacts: [...prev.emergency_contacts, { name: "", phone_number: "", relationship: "", is_primary: false }]
      }));
    } else {
      alert("You can only add up to 3 emergency contacts.");
    }
  };

  const handleRegister = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(formData));
    
    login();
    
    alert("Registration successful! Welcome to RoadAssist Pro!");
    
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl border-t-4 border-red-500">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Your RoadAssist Account</h2>
        <p className="text-center text-gray-600 mb-8">Join our community and get access to premium roadside assistance services</p>

        {/* Personal Details */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition" type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition" type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition" type="tel" name="phone_number" placeholder="+1 (123) 456-7890" value={formData.phone_number} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition" type="text" name="address" placeholder="123 Main St, City, State, Zip" value={formData.address} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4 text-gray-700 border-b pb-2">Emergency Contacts</h3>
          {formData.emergency_contacts.map((contact, index) => (
            <div key={index} className="border p-4 rounded-lg bg-gray-50 mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition" type="text" placeholder="Contact Name" value={contact.name} onChange={(e) => handleEmergencyChange(index, "name", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition" type="tel" placeholder="+1 (123) 456-7890" value={contact.phone_number} onChange={(e) => handleEmergencyChange(index, "phone_number", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <input className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition" type="text" placeholder="e.g., Spouse, Parent, Friend" value={contact.relationship} onChange={(e) => handleEmergencyChange(index, "relationship", e.target.value)} />
              </div>
              <label className="flex items-center space-x-2 md:col-span-2">
                <input 
                  type="checkbox" 
                  checked={contact.is_primary}
                  onChange={(e) => handleEmergencyChange(index, "is_primary", e.target.checked)}
                  className="h-4 w-4 text-red-500 focus:ring-red-500 rounded"
                />
                <span className="text-sm text-gray-700">Set as Primary Emergency Contact</span>
              </label>
            </div>
          ))}

          {/* Add Emergency Contact Button */}
          {formData.emergency_contacts.length < 3 && (
            <button 
              className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md w-full mt-4 hover:bg-gray-200 transition flex items-center justify-center"
              onClick={addEmergencyContact}
            >
              <span className="mr-2">+</span> Add Emergency Contact
            </button>
          )}
        </div>

        {/* Register Button */}
        <button 
          className="bg-red-500 text-white px-6 py-3 rounded-md w-full hover:bg-red-600 transition text-lg font-medium shadow-md" 
          onClick={handleRegister}
        >
          Create Account
        </button>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="text-red-500 font-medium hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
