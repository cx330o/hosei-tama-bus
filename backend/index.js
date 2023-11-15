const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");
const { setupWebSocketServer } = require('./utils/websocketService');

const httpServer = app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

setupWebSocketServer(httpServer);
