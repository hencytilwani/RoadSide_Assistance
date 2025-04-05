import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <button 
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
