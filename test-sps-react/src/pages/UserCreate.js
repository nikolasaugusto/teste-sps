import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { useAuth } from "../contexts/AuthContext";
import Toast from "../components/Toast";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { validatePassword, generateStrongPassword } from "../utils/passwordValidation";

function UserCreate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "user",
    password: ""
  });
  const [showPasswordMeter, setShowPasswordMeter] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();
  const userService = new UserService(() => token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mostrar o medidor de força da senha quando o usuário começar a digitar
    if (name === 'password' && value.length > 0) {
      setShowPasswordMeter(true);
    } else if (name === 'password' && value.length === 0) {
      setShowPasswordMeter(false);
    }
  };

  const handleGeneratePassword = () => {
    const strongPassword = generateStrongPassword();
    setFormData(prev => ({
      ...prev,
      password: strongPassword
    }));
    setShowPasswordMeter(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar senha antes de enviar
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setToast({
        message: `Erro na validação da senha: ${passwordValidation.errors.join(', ')}`,
        type: "error"
      });
      return;
    }

    try {
      await userService.create(formData);
      setToast({ message: "Usuário criado com sucesso!", type: "success" });

      setTimeout(() => {
        navigate("/users");
      }, 1500);
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <div className="form-container">
      <h2 className="page-title">Cadastrar Novo Usuário</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nome:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type" className="form-label">
            Tipo:
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-select"
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Senha:
          </label>
          <div className="password-input-container">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="btn btn-secondary generate-password-btn"
              title="Gerar senha forte"
            >
              🔐
            </button>
          </div>

          {showPasswordMeter && (
            <PasswordStrengthMeter password={formData.password} />
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="btn btn-secondary"
          >
            Voltar
          </button>

          <button
            type="submit"
            className="btn btn-primary"
          >
            Cadastrar
          </button>
        </div>
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

export default UserCreate;
