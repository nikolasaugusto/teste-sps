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

  const toastClass = `toast ${type === "error" ? "toast-error" : "toast-success"}`;

  return (
    <div className={toastClass}>
      {message}
    </div>
  );
};

export default Toast;
