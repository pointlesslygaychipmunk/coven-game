import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { createGameState } from "./createGameState"; // ✅ assumes this constructs and returns a full GameState

const app = express();

app.use(cors({
  origin: "https://coven-frontend.onrender.com",
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://coven-frontend.onrender.com",
  },
});

// ✅ Confirm backend is reachable
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// ✅ Return initial game state
app.get("/start", (req, res) => {
  const gameState = createGameState();
  res.json(gameState);
});

// Placeholder POST endpoints
app.post("/plant", (req, res) => {
  const { type, index, gameState } = req.body;
  res.json(gameState);
});
app.post("/harvest", (req, res) => {
  res.json(req.body.gameState);
});
app.post("/brew", (req, res) => {
  res.json(req.body.gameState);
});
app.post("/fulfill", (req, res) => {
  res.json(req.body.gameState);
});
app.post("/plant-tree", (req, res) => {
  res.json(req.body.gameState);
});
app.post("/fell-tree", (req, res) => {
  res.json(req.body.gameState);
});
app.post("/buy", (req, res) => {
  res.json(req.body.gameState);
});
app.post("/sell", (req, res) => {
  res.json(req.body.gameState);
});
app.post("/upgrade", (req, res) => {
  res.json(req.body.gameState);
});
app.post("/advance", (req, res) => {
  res.json({ ...req.body.gameState, gameOver: false });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});