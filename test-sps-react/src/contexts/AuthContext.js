import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

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
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("currentUser");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setCurrentUser(JSON.parse(storedUser));
      } catch (_) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const api = useMemo(() => axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000" }), []);

  const login = async ({ email, password }) => {
    // Privacy-preserving challenge-response
    try {
      const ch = await api.get("/auth/challenge", { params: { email } });
      const nonce = ch.data?.nonce;
      if (!nonce) throw new Error("Challenge inválido");
      const encoder = new TextEncoder();
      const key = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(String(password)),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await window.crypto.subtle.sign("HMAC", key, encoder.encode(String(nonce)));
      const proof = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, "0")).join("");
      const res = await api.post("/auth/login-challenge", { email, proof });
      setCurrentUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      return res.data.user;
    } catch (e) {
      // Fallback to direct login if challenge flow is not supported by server
      const res = await api.post("/auth/login", { email, password });
      setCurrentUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      return res.data.user;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  };

  const switchUser = (userData) => {
    setCurrentUser(userData);
    return userData;
  };

  const value = {
    currentUser,
    token,
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
