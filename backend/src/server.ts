import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createInitialGameState } from "./createGameState";

const app = express();
app.use(cors({ origin: "https://coven-frontend.onrender.com" }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "https://coven-frontend.onrender.com" }
});

// ✅ Test ping
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// ✅ Initial game state endpoint
app.get("/init", (req, res) => {
  const gameState = createInitialGameState();
  console.log("Initialized game state:", gameState);
  res.json(gameState);
});

// ✅ Echo endpoints (update later with real logic)
app.post("/plant", (req, res) => res.json(req.body.gameState));
app.post("/harvest", (req, res) => res.json(req.body.gameState));
app.post("/brew", (req, res) => res.json(req.body.gameState));
app.post("/fulfill", (req, res) => res.json(req.body.gameState));
app.post("/plant-tree", (req, res) => res.json(req.body.gameState));
app.post("/fell-tree", (req, res) => res.json(req.body.gameState));
app.post("/buy", (req, res) => res.json(req.body.gameState));
app.post("/sell", (req, res) => res.json(req.body.gameState));
app.post("/upgrade", (req, res) => res.json(req.body.gameState));
app.post("/advance", (req, res) => res.json({ ...req.body.gameState, gameOver: false }));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});