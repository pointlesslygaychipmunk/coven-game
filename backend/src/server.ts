// backend/src/server.ts

import express from "express";
import cors from "cors";
import http from "http";
import { setupPlayController } from "./playController";
import { executeActions } from "./executeActions";
import { advanceTurn } from "./turnEngine";
import { createGameState } from "./createGameState";
import type { GameState, Action } from "../../shared/types";

import { Server as IOServer } from "socket.io";

// CORS setup
const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://playcoven.com"], 
  methods: ["GET","POST","OPTIONS"],
}));
app.options("*", cors());
app.use(express.json());

let state: GameState = createGameState();

app.get("/state", (_req, res) => {
  res.json(state);
});

app.post("/execute-actions", (req, res) => {
  const { playerId, actions } = req.body as { playerId: string; actions: Action[] };
  state = executeActions(state, playerId, actions);
  res.json(state);
});

app.post("/play-turn", (_req, res) => {
  state = advanceTurn(state);
  res.json(state);
});

const server = http.createServer(app);
const io = new IOServer(server);

setupPlayController(io);

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});
