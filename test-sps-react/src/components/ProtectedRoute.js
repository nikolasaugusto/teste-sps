import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated || !currentUser) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
