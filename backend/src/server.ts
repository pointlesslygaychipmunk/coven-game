// backend/src/server.ts

import path from "path";
import express from "express";
import cors from "cors";
import http from "http";
import { setupPlayController } from "./playController";
import { executeActions }      from "./executeActions";
import { advanceTurn }         from "./turnEngine";
import { createGameState }     from "./createGameState";
import type { GameState, Action } from "../../shared/types";
import { Server as IOServer }  from "socket.io";

const app = express();

app.use(cors());

// Parse JSON bodies
app.use(express.json());

// --- API Endpoints ---

let state: GameState = createGameState();

app.get("/state", (_req, res) => res.json(state));

app.post("/execute-actions", (req, res) => {
  const { playerId, actions } = req.body as { playerId: string; actions: Action[] };
  state = executeActions(state, playerId, actions);
  res.json(state);
});

app.post("/play-turn", (_req, res) => {
  state = advanceTurn(state);
  res.json(state);
});

// --- Static Front-end ---

const staticDir = path.join(__dirname, "../frontend/dist");
app.use(express.static(staticDir));

app.get("*", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

// --- HTTP & Socket.IO ---

const server = http.createServer(app);
const io     = new IOServer(server);

setupPlayController(io);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});