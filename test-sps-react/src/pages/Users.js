import React, { useEffect, useState } from "react";
import UserService from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Users() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userService = new UserService();

  const { currentUser, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setUser(currentUser);
    } else {
      navigate("/signin");
    }
  }, [navigate, isAuthenticated, currentUser]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const usersList = await userService.list();
      setUsers(usersList);
    } catch (error) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await userService.delete(userId);
        // Refresh the user list
        fetchUsers();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/signin");
  };

  if (!user) {
    return <div>Redirecionando para login...</div>;
  }

  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Usuários</h1>
        <div>
          {currentUser?.type === 'admin' && (
            <button
              onClick={() => navigate("/users/create")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Cadastrar Novo Usuário
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      </div>

      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0" }}>
        <p>Usuário logado: {user.email}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa", textAlign: "left" }}>
              <th style={{ padding: "12px", borderBottom: "1px solid #dee2e6" }}>Nome</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #dee2e6" }}>Email</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #dee2e6" }}>Tipo</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #dee2e6", textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const canEdit = (currentUser?.type === 'admin') || (currentUser?.type === 'user' && u.id === currentUser?.id);
              const canDelete = canEdit && u.email !== 'admin@sps.com';
              return (
                <tr key={u.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "12px" }}>{u.name}</td>
                  <td style={{ padding: "12px" }}>{u.email}</td>
                  <td style={{ padding: "12px" }}>{u.type}</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    {canEdit && (
                      <button
                        onClick={() => navigate(`/users/${u.id}`)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                      >
                        Editar
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
