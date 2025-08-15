import React, { useEffect, useState, useMemo, useCallback } from "react";
import UserService from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Users() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout, token } = useAuth();
  const userService = useMemo(() => new UserService(() => token), [token]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await userService.list(page, limit);
      setUsers(response.users || []);
      setTotal(response.total || 0);
    } catch (error) {
      // noop
    } finally {
      setLoading(false);
    }
  }, [userService, page]);

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
  }, [user, fetchUsers]);

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

  const filteredUsers = useMemo(() => {
    let list = [...users];
    const normalizedQuery = search.trim().toLowerCase();

    if (normalizedQuery) {
      list = list.filter((u) => (u.name || "").toLowerCase().includes(normalizedQuery));
    }

    if (typeFilter !== "all") {
      list = list.filter((u) => u.type === typeFilter);
    }

    const compareNameAsc = (a, b) => (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" });
    const getCreatedMs = (u) => {
      const idStr = String(u.id || "");
      const ts = parseInt(idStr.split("-")[0], 10);
      return Number.isFinite(ts) ? ts : 0; // Admin seed (id "1") vira mais antigo
    };

    switch (sort) {
      case "name-asc":
        list.sort(compareNameAsc);
        break;
      case "name-desc":
        list.sort((a, b) => compareNameAsc(b, a));
        break;
      case "created-desc":
        list.sort((a, b) => getCreatedMs(b) - getCreatedMs(a));
        break;
      case "created-asc":
        list.sort((a, b) => getCreatedMs(a) - getCreatedMs(b));
        break;
      default:
        break;
    }

    return list;
  }, [users, search, typeFilter, sort]);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/signin");
  };

  if (!user) {
    return <div className="redirecting">Redirecionando para login...</div>;
  }

  if (loading) {
    return <div className="loading">Carregando usuários...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Usuários</h1>
        <div>
          <button
            onClick={() => navigate("/")}
            className="btn btn-secondary"
            style={{ marginRight: "10px" }}
            title="Voltar ao início"
          >
            🏠 Voltar ao Início
          </button>
          {currentUser?.type === 'admin' && (
            <button
              onClick={() => navigate("/users/create")}
              className="btn btn-primary"
              style={{ marginRight: "10px" }}
            >
              Cadastrar Novo Usuário
            </button>
          )}
          <button
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="user-info">
        <p>Usuário logado: {user.email}</p>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todos os tipos</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuário</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
        >
          <option value="name-asc">Nome (A–Z)</option>
          <option value="name-desc">Nome (Z–A)</option>
          <option value="created-desc">Criados: mais novos primeiro</option>
          <option value="created-asc">Criados: mais antigos primeiro</option>
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th className="actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const canEdit = (currentUser?.type === 'admin') || (currentUser?.type === 'user' && u.id === currentUser?.id);
              const canDelete = canEdit && u.email !== 'admin@sps.com';
              return (
                <tr key={u.id} className="table-row">
                  <td className="table-cell">{u.name}</td>
                  <td className="table-cell">{u.email}</td>
                  <td className="table-cell">{u.type}</td>
                  <td className="table-cell actions">
                    <div className="action-buttons">
                      {canEdit && (
                        <button
                          onClick={() => navigate(`/users/${u.id}`)}
                          className="btn btn-success btn-small"
                        >
                          Editar
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="btn btn-danger btn-small"
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination-controls" style={{ marginTop: "10px", textAlign: "center" }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page <= 1} className="btn btn-secondary" style={{ marginRight: "5px" }}>
          Anterior
        </button>
        <span>Página {page} de {Math.ceil(total / limit) || 1}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, Math.ceil(total / limit) || 1))} disabled={page >= Math.ceil(total / limit) || total === 0} className="btn btn-secondary" style={{ marginLeft: "5px" }}>
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Users;
