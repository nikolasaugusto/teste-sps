const { Router } = require("express");
const bodyParser = require("express").json;
const db = require("./db");
const { authMiddleware, handleLogin, handleChallenge, handleLoginChallenge } = require("./auth");
const { validateBody, validateQuery, schemas } = require("./validation");

const routes = Router();
routes.use(bodyParser());

// Helper to remove sensitive fields from user objects
function publicUser(u) {
  if (!u) return null;
  const { id, name, email, type } = u;
  return { id, name, email, type };
}

routes.get("/", (req, res) => res.send("OK"));
routes.post("/auth/login", validateBody(schemas.login), handleLogin);
routes.get("/auth/challenge", validateQuery(schemas.challengeQuery), handleChallenge);
routes.post("/auth/login-challenge", validateBody(schemas.loginChallenge), handleLoginChallenge);

// Users CRUD
routes.get("/users", authMiddleware, (req, res) => {
  const { page = "1", limit = "5" } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const allUsers = db.getUsers().map(publicUser);
  const total = allUsers.length;
  const start = (pageNum - 1) * limitNum;
  const paged = allUsers.slice(start, start + limitNum);
  return res.json({ users: paged, total, page: pageNum, limit: limitNum });
});

routes.get("/users/:id", authMiddleware, (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
  return res.json(publicUser(user));
});

routes.post("/users", authMiddleware, validateBody(schemas.createUser), (req, res) => {
  try {
    const { name, email, type, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: "Dados inválidos" });
    const user = db.createUser({ name, email, type, password });
    return res.status(201).json(publicUser(user));
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || "Erro" });
  }
});

routes.put("/users/:id", authMiddleware, validateBody(schemas.updateUser), (req, res) => {
  try {
    const user = db.updateUser(req.params.id, req.body || {});
    return res.json(publicUser(user));
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || "Erro" });
  }
});

routes.delete("/users/:id", authMiddleware, (req, res) => {
  try {
    db.deleteUser(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || "Erro" });
  }
});

module.exports = routes;
