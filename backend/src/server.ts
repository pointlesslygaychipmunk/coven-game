// backend/src/server.ts

import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

import { createGameState } from "./createGameState";
import { advanceTurn }      from "./turnEngine";
import { executeActions }   from "./executeActions";

import { GameState, Action } from "../../shared/types";

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// In‐memory single game instance (or swap for a map of games)
let gameState: GameState = createGameState();

// --- Socket.IO real‐time handlers ---
io.on("connection", (socket: Socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);
  // Send current state immediately
  socket.emit("state", gameState);

  // Optional: client can register its playerId
  socket.on("register", (data: { playerId: string }) => {
    socket.data.playerId = data.playerId;
  });

  // Player submits actions
  socket.on("executeActions", (data: { playerId: string; actions: Action[] }) => {
    const { playerId, actions } = data;
    try {
      gameState = executeActions(gameState, actions, playerId);
      // Broadcast updated state
      io.emit("state", gameState);
    } catch (err: any) {
      console.error("Action execution error:", err);
      socket.emit("error", { message: err.message });
    }
  });

  // Advance global turn / moon phase
  socket.on("advanceTurn", () => {
    try {
      gameState = advanceTurn(gameState);
      io.emit("state", gameState);
    } catch (err: any) {
      console.error("Turn advance error:", err);
      socket.emit("error", { message: err.message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// --- HTTP‐fallback endpoints ---
app.get("/state", (_req: Request, res: Response) => {
  return res.json(gameState);
});

app.post("/execute-actions", (req: Request, res: Response) => {
  const { playerId, actions } = req.body as { playerId?: string; actions?: Action[] };
  if (!playerId || !Array.isArray(actions)) {
    return res.status(400).json({ error: "Missing playerId or actions" });
  }
  try {
    gameState = executeActions(gameState, actions, playerId);
    io.emit("state", gameState);
    return res.json(gameState);
  } catch (err: any) {
    console.error("HTTP execute‐actions error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/play-turn", (_req: Request, res: Response) => {
  try {
    gameState = advanceTurn(gameState);
    io.emit("state", gameState);
    return res.json(gameState);
  } catch (err: any) {
    console.error("HTTP play-turn error:", err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🌙 Coven backend listening on port ${PORT}`);
});