const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const messageRouter = require("./routers/messages");
const fileRouter = require("./routers/files");
const downloadRouter = require("./routers/download");
const middleware = require("./utils/middleware");

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/files", fileRouter);
app.use("/api/download", downloadRouter);
app.use("/api/messages", messageRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
