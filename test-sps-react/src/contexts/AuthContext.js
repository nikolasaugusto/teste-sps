import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userWithToken = {
      ...userData,
      token: btoa(userData.email + ":" + userData.password),
    };
    setCurrentUser(userWithToken);
    localStorage.setItem("currentUser", JSON.stringify(userWithToken));
    return userWithToken;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const switchUser = (userData) => {
    const userWithToken = {
      ...userData,
      token: btoa(userData.email + ":" + userData.password),
    };
    setCurrentUser(userWithToken);
    localStorage.setItem("currentUser", JSON.stringify(userWithToken));
    return userWithToken;
  };

  const value = {
    currentUser,
    login,
    logout,
    switchUser,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
