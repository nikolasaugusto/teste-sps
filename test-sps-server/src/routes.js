const { Router } = require("express");
const bodyParser = require("express").json;
const db = require("./db");
const { authMiddleware, handleLogin, handleChallenge, handleLoginChallenge } = require("./auth");

const routes = Router();
routes.use(bodyParser());

routes.get("/", (req, res) => res.send("OK"));
routes.post("/auth/login", handleLogin);
routes.get("/auth/challenge", handleChallenge);
routes.post("/auth/login-challenge", handleLoginChallenge);

// Users CRUD
routes.get("/users", authMiddleware, (req, res) => {
  return res.json(db.getUsers());
});

routes.get("/users/:id", authMiddleware, (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
  return res.json(user);
});

routes.post("/users", authMiddleware, (req, res) => {
  try {
    const { name, email, type, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: "Dados inválidos" });
    const user = db.createUser({ name, email, type, password });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || "Erro" });
  }
});

routes.put("/users/:id", authMiddleware, (req, res) => {
  try {
    const user = db.updateUser(req.params.id, req.body || {});
    return res.json(user);
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
