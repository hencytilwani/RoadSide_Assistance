import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
<<<<<<< HEAD
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
=======
  // Initialize isAuthenticated from localStorage but ensure it's false if not explicitly set to true
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  useEffect(() => {
    // Only save to localStorage when there's an actual change
    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
    } else {
      localStorage.removeItem("isAuthenticated");
    }
>>>>>>> Rushita
  }, [isAuthenticated]);

  const login = () => {
    setIsAuthenticated(true);
<<<<<<< HEAD
    localStorage.setItem("isAuthenticated", JSON.stringify(true)); // ✅ Save login state
=======
>>>>>>> Rushita
  };

  const logout = () => {
    setIsAuthenticated(false);
<<<<<<< HEAD
    localStorage.removeItem("isAuthenticated"); // ✅ Remove auth state on logout
=======
    localStorage.removeItem("isAuthenticated");
    // Also clear user data on logout for complete sign-out
    localStorage.removeItem("user");
>>>>>>> Rushita
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
