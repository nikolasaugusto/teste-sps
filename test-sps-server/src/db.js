const fs = require("fs");
const path = require("path");

const databaseFilePath = path.join(__dirname, "db.json");

let databaseCache = null;

function defaultDatabase() {
    return {
        users: [
            {
                id: "1",
                name: "Admin User",
                email: "admin@sps.com",
                type: "admin",
                password: "admin123",
            },
        ],
    };
}

function ensureDatabaseOnDisk() {
    if (!fs.existsSync(databaseFilePath)) {
        fs.writeFileSync(databaseFilePath, JSON.stringify(defaultDatabase(), null, 2), "utf8");
    }
}

function readDatabaseFromDisk() {
    ensureDatabaseOnDisk();
    try {
        const content = fs.readFileSync(databaseFilePath, "utf8");
        const parsed = JSON.parse(content || "{}");
        if (!parsed.users || !Array.isArray(parsed.users)) {
            parsed.users = defaultDatabase().users;
        }
        return parsed;
    } catch (_) {
        const fallback = defaultDatabase();
        fs.writeFileSync(databaseFilePath, JSON.stringify(fallback, null, 2), "utf8");
        return fallback;
    }
}

function writeDatabaseToDisk(data) {
    fs.writeFileSync(databaseFilePath, JSON.stringify(data, null, 2), "utf8");
}

function getDatabase() {
    if (!databaseCache) {
        databaseCache = readDatabaseFromDisk();
    }
    return databaseCache;
}

function saveDatabase(db) {
    databaseCache = db;
    writeDatabaseToDisk(db);
}

function generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function getUsers() {
    const db = getDatabase();
    return [...(db.users || [])];
}

function getUserById(id) {
    const db = getDatabase();
    return (db.users || []).find((u) => u.id === id) || null;
}

function findUserByEmail(email) {
    const db = getDatabase();
    return (db.users || []).find((u) => u.email === email) || null;
}

function createUser({ name, email, type = "user", password }) {
    const db = getDatabase();
    db.users = db.users || [];
    const existing = findUserByEmail(email);
    if (existing) {
        const error = new Error("Email já cadastrado");
        error.status = 409;
        throw error;
    }
    const id = generateId();
    const newUser = { id, name, email, type, password };
    db.users.push(newUser);
    saveDatabase(db);
    return newUser;
}

function updateUser(id, updates) {
    const db = getDatabase();
    db.users = db.users || [];
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) {
        const error = new Error("Usuário não encontrado");
        error.status = 404;
        throw error;
    }
    if (updates.email) {
        const duplicate = db.users.find((u) => u.email === updates.email && u.id !== id);
        if (duplicate) {
            const error = new Error("Email já cadastrado");
            error.status = 409;
            throw error;
        }
    }
    const next = { ...db.users[index], ...updates };
    if (!updates.password) {
        next.password = db.users[index].password;
    }
    db.users[index] = next;
    saveDatabase(db);
    return db.users[index];
}

function deleteUser(id) {
    const db = getDatabase();
    db.users = db.users || [];
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) {
        const error = new Error("Usuário não encontrado");
        error.status = 404;
        throw error;
    }
    if (db.users[index].email === "admin@sps.com") {
        const error = new Error("Não é possível excluir o usuário administrador");
        error.status = 400;
        throw error;
    }
    db.users.splice(index, 1);
    saveDatabase(db);
    return true;
}

module.exports = {
    getUsers,
    getUserById,
    findUserByEmail,
    createUser,
    updateUser,
    deleteUser,
};


