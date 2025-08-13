import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../services/UserService";
import Toast from "../components/Toast";
import { useAuth } from "../contexts/AuthContext";

export function userLoader({ params }) {
  return { userId: params.userId };
}

function UserEdit() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "user",
    password: ""
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout, token } = useAuth();
  const userService = useMemo(() => new UserService(() => token), [token]);
  const isAdmin = currentUser?.type === "admin";
  const isSelf = currentUser?.id === userId;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [navigate, isAuthenticated]);

  // Restrict access: non-admin users can only edit their own profile
  useEffect(() => {
    if (isAuthenticated && currentUser && !isAdmin && !isSelf) {
      setToast({ message: "Sem permissão para editar este usuário", type: "error" });
      setTimeout(() => navigate("/users"), 1500);
    }
  }, [isAuthenticated, currentUser, isAdmin, isSelf, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userService.get(userId);
        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
            type: user.type,
            password: ""
          });
        } else {
          setToast({
            message: "Usuário não encontrado",
            type: "error"
          });
          setTimeout(() => navigate("/users"), 1500);
        }
      } catch (error) {
        setToast({ message: "Erro ao carregar usuário", type: "error" });
        setTimeout(() => navigate("/users"), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate, userService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = isAdmin
        ? formData
        : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };
      await userService.update(userId, payload);
      setToast({
        message: "Usuário atualizado com sucesso!",
        type: "success"
      });
      setTimeout(() => {
        navigate("/users");
      }, 1500);
    } catch (error) {
      setToast({
        message: error.message,
        type: "error"
      });
    }
  };

  const handleDelete = async () => {
    if (!isAdmin && !isSelf) {
      setToast({ message: "Sem permissão para excluir este usuário", type: "error" });
      return;
    }
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await userService.delete(userId);
        setToast({ message: "Usuário excluído com sucesso!", type: "success" });
        setTimeout(() => {
          if (isSelf && !isAdmin) {
            logout();
            navigate("/signin");
          } else {
            navigate("/users");
          }
        }, 800);
      } catch (error) {
        setToast({
          message: error.message,
          type: "error"
        });
      }
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Editar Usuário</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>
            Nome:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          />
        </div>

        {isAdmin ? (
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="type" style={{ display: "block", marginBottom: "5px" }}>
              Tipo:
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        ) : (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Tipo:</label>
            <div>{formData.type}</div>
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>
            Senha (deixe em branco para manter a atual):
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="Deixe em branco para manter a senha atual"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button
            type="button"
            onClick={() => navigate("/users")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Voltar
          </button>

          <div>
            {(isAdmin || isSelf) && formData.email !== 'admin@sps.com' && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Excluir
              </button>
            )}

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Salvar
            </button>
          </div>
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

export default UserEdit;
