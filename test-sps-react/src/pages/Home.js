import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="container">
      <h1 className="page-title">SPS REACT TEST</h1>
      <div style={{ textAlign: "center" }}>
        <a href="/users" className="btn btn-primary" style={{ display: "inline-block", marginBottom: "10px" }}>
          Usuários
        </a>
        <br />
        {isAuthenticated && currentUser ? (
          <>
            <p>Bem‑vindo, {currentUser.email}</p>
            <button onClick={handleLogout} className="btn btn-danger" style={{ display: "inline-block", marginTop: "10px" }}>
              Sair
            </button>
          </>
        ) : (
          <a href="/signin" className="btn btn-secondary" style={{ display: "inline-block", marginTop: "10px" }}>
            Login
          </a>
        )}
      </div>
    </div>
  );
}

export default Home;
