const request = require("supertest");
const app = require("../app");
const crypto = require("crypto");

function computeProofHex(password, nonce) {
    return crypto.createHmac("sha256", String(password)).update(String(nonce)).digest("hex");
}

describe("Auth challenge", () => {
    test("should login via challenge and get JWT", async () => {
        const email = "admin@sps.com";
        const ch = await request(app).get("/auth/challenge").query({ email }).expect(200);
        const { nonce } = ch.body;
        expect(nonce).toBeDefined();

        const proof = computeProofHex("admin123", nonce);
        const res = await request(app).post("/auth/login-challenge").send({ email, proof }).expect(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user).toBeDefined();
    });

    test("should fail with wrong proof", async () => {
        const email = "admin@sps.com";
        const ch = await request(app).get("/auth/challenge").query({ email }).expect(200);
        const res = await request(app).post("/auth/login-challenge").send({ email, proof: "0".repeat(64) });
        expect(res.status).toBe(401);
    });
});
