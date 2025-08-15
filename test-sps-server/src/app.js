const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(cors());
app.use(helmet());

const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/auth", authLimiter);

app.use(routes);

module.exports = app;
