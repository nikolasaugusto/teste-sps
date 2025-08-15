const { z } = require("zod");

const email = z.string().email();
const name = z.string().min(1).max(100);
const type = z.enum(["admin", "user"]).optional().default("user");
const password = z.string().min(4);

const createUserSchema = z.object({
    name,
    email,
    type,
    password,
});

const updateUserSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    type: z.enum(["admin", "user"]).optional(),
    password: z.string().min(4).optional(),
});

const loginSchema = z.object({
    email,
    password,
});

const challengeQuerySchema = z.object({
    email,
});

const loginChallengeSchema = z.object({
    email,
    proof: z.string().regex(/^[0-9a-fA-F]{64}$/),
});

function validateBody(schema) {
    return (req, res, next) => {
        const parse = schema.safeParse(req.body || {});
        if (!parse.success) {
            return res.status(400).json({ message: "Dados inválidos", issues: parse.error.issues });
        }
        req.body = parse.data;
        next();
    };
}

function validateQuery(schema) {
    return (req, res, next) => {
        const parse = schema.safeParse(req.query || {});
        if (!parse.success) {
            return res.status(400).json({ message: "Dados inválidos", issues: parse.error.issues });
        }
        req.query = parse.data;
        next();
    };
}

module.exports = {
    validateBody,
    validateQuery,
    schemas: {
        createUser: createUserSchema,
        updateUser: updateUserSchema,
        login: loginSchema,
        challengeQuery: challengeQuerySchema,
        loginChallenge: loginChallengeSchema,
    },
};
