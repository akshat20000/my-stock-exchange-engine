import { createClient } from "redis";
import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Redis client (ESM-compatible)
const redis = createClient({ url: "redis://localhost:6379" });

redis.on("error", (err) => console.error("Redis error:", err));

await redis.connect();

// Subscribe to incoming trade messages
await redis.subscribe("trade_channel", (message) => {
  console.log("Relaying new trade:", message);
  io.emit("NewTrade", JSON.parse(message));
});

server.listen(4000, () => {
  console.log("Socket relay running on http://localhost:4000");
});
