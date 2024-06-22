const logger = require("./logger");
const config = require("./config");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [code] = decoded.split(":");
    if (code !== config.ACCESS_CODE) return res.status(401).json({ error: "Invalid token" });
    next();
  } catch { return res.status(401).json({ error: "Invalid token" }); }
};

const unknownEndpoint = (req, res) => { res.status(404).send({ error: "unknown endpoint" }); };

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === "CastError") return res.status(400).send({ error: "malformatted id" });
  else if (error.name === "ValidationError") return res.status(400).json({ error: error.message });
  next(error);
};

module.exports = { requestLogger, authGuard, unknownEndpoint, errorHandler };
