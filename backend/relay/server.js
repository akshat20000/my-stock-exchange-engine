const { createClient } = require("redis");
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const redis = createClient();
redis.connect();

redis.subscribe("trade_channel", (message) => {
  console.log("Relaying new trade:", message);
  io.emit("newTrade", JSON.parse(message));
});

server.listen(4000, () => console.log("Socket relay running on 4000"));
