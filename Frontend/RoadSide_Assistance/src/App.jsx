import React from "react";
import HomePage from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import HomePage from "./pages/HomePage";
// import QuickAssistance from "./pages/QuickAssistance";
import AIVehicleDiagnosis from "./pages/AIVehicleDiagnosis";
import ARGuidePage from "./pages/ARGuidePage";
import VehicleHealthPage from "./pages/VehicleHealthPage";
import MaintenanceSchedule from "./pages/MaintenanceSchedule";
import FleetDashboard from "./pages/FleetDashboard";
import RoadsideGuardian from "./pages/RoadsideGuardian";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";



function App() {
  console.log("Calling")
  return (
    <AuthProvider>
    <Router>
    <Navbar />
    <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          {/* Protected Routes (Wrap inside PrivateRoute) */}
          <Route element={<PrivateRoute />}>
            {/* <Route path="/quick-assistance" element={<QuickAssistance />} /> */}
            <Route path="/ai-diagnosis" element={<AIVehicleDiagnosis />} />
            <Route path="/ar-guide" element={<ARGuidePage />} />
            <Route path="/vehicle-health" element={<VehicleHealthPage />} />
            <Route path="/maintenance" element={<MaintenanceSchedule />} />
            <Route path="/fleet" element={<FleetDashboard />} />
            <Route path="/roadside-guardian" element={<RoadsideGuardian />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>

        {/* Common Footer */}
        <Footer />
    </Router>
  </AuthProvider>
  );
}

export default App;
