import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useAuth } from "../contexts/AuthContext";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/users");
    } catch (error) {
      setToast({ message: "Erro ao verificar credenciais", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <div className="login-container">
      <h2 className="page-title">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Senha:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
}

export default SignIn;
