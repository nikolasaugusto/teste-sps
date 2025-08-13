const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("./db");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

function createToken(user) {
    const payload = { id: user.id, email: user.email, type: user.type, name: user.name };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function authMiddleware(req, res, next) {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (!token) return res.status(401).json({ message: "Não autenticado" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
}

function handleLogin(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Dados inválidos" });
    const user = db.findUserByEmail(email);
    if (!user || user.password !== password) return res.status(401).json({ message: "Credenciais inválidas" });
    const token = createToken(user);
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, type: user.type } });
}

module.exports = { authMiddleware, handleLogin };

// --- Optional challenge-response flow to avoid sending raw password ---
const challenges = new Map();

function createNonce() {
    return crypto.randomBytes(16).toString("hex");
}

function handleChallenge(req, res) {
    const email = (req.query.email || "").toString();
    const user = db.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    const nonce = createNonce();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    challenges.set(email, { nonce, expiresAt });
    return res.json({ nonce });
}

function timingSafeEqualHex(aHex, bHex) {
    try {
        const a = Buffer.from(aHex, "hex");
        const b = Buffer.from(bHex, "hex");
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
    } catch (_) {
        return false;
    }
}

function computeProofHex(password, nonce) {
    return crypto.createHmac("sha256", String(password)).update(String(nonce)).digest("hex");
}

function handleLoginChallenge(req, res) {
    const { email, proof } = req.body || {};
    if (!email || !proof) return res.status(400).json({ message: "Dados inválidos" });
    const user = db.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Credenciais inválidas" });
    const challenge = challenges.get(email);
    if (!challenge || challenge.expiresAt < Date.now()) {
        return res.status(400).json({ message: "Desafio expirado" });
    }
    const expected = computeProofHex(user.password, challenge.nonce);
    challenges.delete(email);
    if (!timingSafeEqualHex(expected, String(proof))) {
        return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const token = createToken(user);
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, type: user.type } });
}

module.exports.handleChallenge = handleChallenge;
module.exports.handleLoginChallenge = handleLoginChallenge;


