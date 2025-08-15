const request = require("supertest");
const app = require("../app");
const crypto = require("crypto");

function computeProofHex(password, nonce) {
    return crypto.createHmac("sha256", String(password)).update(String(nonce)).digest("hex");
}

async function getAdminToken() {
    const email = "admin@sps.com";
    const ch = await request(app).get("/auth/challenge").query({ email });
    const proof = computeProofHex("admin123", ch.body.nonce);
    const res = await request(app).post("/auth/login-challenge").send({ email, proof });
    return res.body.token;
}

describe("Users endpoints", () => {
    test("GET /users returns public users (no password)", async () => {
        const token = await getAdminToken();
        const res = await request(app).get("/users").set("Authorization", `Bearer ${token}`).expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        for (const u of res.body) {
            expect(u.password).toBeUndefined();
            expect(u.email).toBeDefined();
        }
    });

    test("POST /users returns sanitized user", async () => {
        const token = await getAdminToken();
        const res = await request(app)
            .post("/users")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "User T", email: `t${Date.now()}@sps.com`, type: "user", password: "1234" })
            .expect(201);
        expect(res.body.password).toBeUndefined();
    });

    test("PUT /users/:id returns sanitized user", async () => {
        const token = await getAdminToken();

        const create = await request(app)
            .post("/users")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "User U", email: `u${Date.now()}@sps.com`, type: "user", password: "1234" });

        const res = await request(app)
            .put(`/users/${create.body.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "User U2" })
            .expect(200);

        expect(res.body.password).toBeUndefined();
        expect(res.body.name).toBe("User U2");
    });
});
