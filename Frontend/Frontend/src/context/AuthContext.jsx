import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);

    startAutoLogout(decoded);
  };

  const startAutoLogout = (decodedToken) => {
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    const timeout = expirationTime - currentTime;

    if (timeout > 0) {
      setTimeout(() => {
        alert("Session expired. Please login again.");
        logout();
        window.location.href = "/login";
      }, timeout);
    } else {
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        startAutoLogout(decoded);
      } catch {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);