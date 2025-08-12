import React, { useState, useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const toastStyle = {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "16px",
    borderRadius: "4px",
    color: "white",
    fontWeight: "bold",
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    ...(type === "error" ? { backgroundColor: "#e74c3c" } : { backgroundColor: "#2ecc71" }),
  };

  return (
    <div style={toastStyle}>
      {message}
    </div>
  );
};

export default Toast;
