const WebSocket = require("ws");

let wss;

function setupWebSocketServer(server) {
  wss = new WebSocket.Server({ server });
  wss.on("connection", function connection(ws) {
    console.log("A new websocket client connected");
    ws.on("message", function incoming(message) { console.log("received: %s", message); });
    ws.send(JSON.stringify({ type: "welcome", message: "Welcome to the WebSocket server!" }));
  });
}

function broadcastMessage(data) {
  if (!wss) return;
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(data));
  });
}

module.exports = { setupWebSocketServer, broadcastMessage };
