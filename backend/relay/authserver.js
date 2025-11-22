import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { register, login, logout, getMe, verifyToken } from "./auth/authcontrollers.js";

dotenv.config();

const app = express();
const PORT = process.env.AUTH_SERVER_PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Auth Server" });
});

// Auth routes
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.post("/api/auth/logout", verifyToken, logout);
app.get("/api/auth/me", verifyToken, getMe);

// Start server
app.listen(PORT, () => {
  console.log(`🔐 Auth server running on http://localhost:${PORT}`);
});