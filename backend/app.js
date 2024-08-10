const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const messageRouter = require("./routers/messages");
const fileRouter = require("./routers/files");
const downloadRouter = require("./routers/download");
const middleware = require("./utils/middleware");

// 引入定时任务
require("./utils/cleanupTasks");

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

// Public routes
app.use("/api/files", fileRouter);
app.use("/api/download", downloadRouter);

// Protected routes
app.use("/api/messages", messageRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
