const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
let messages = [];

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send old messages (history)
  ws.send(JSON.stringify({ type: "history", messages }));

  ws.on("message", (data) => {
    const message = JSON.parse(data);
    messages.push(message);

    // Broadcast message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "message", message }));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:8080");
