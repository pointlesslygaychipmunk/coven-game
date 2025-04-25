// backend/src/server.ts

import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { createGameState } from "./createGameState";
import { playTurn } from "./playController";
import { executeActions } from "./executeActions";

import {
  validateWater,
  validatePlant,
  validateHarvest,
  validateBrew,
  validateSell,
  validateBuy
} from "./validate";

const app = express();

const corsOptions = {
  origin: [
    "https://playcoven.com",
    "https://coven-frontend.onrender.com",
    "http://localhost:5173",
    "null"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.options("*", (_req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.sendStatus(204);
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "https://coven-frontend.onrender.com" }
});

app.get("/ping", (_req: Request, res: Response) => {
  res.json({ message: "pong" });
});

app.get("/init", (_req: Request, res: Response) => {
  const initialState = createGameState();
  res.json(initialState);
});

app.post("/execute-actions", (req: Request, res: Response) => {
  const { gameState, actions, playerId } = req.body;
  if (!gameState || !actions || !playerId) {
    return res.status(400).json({ error: "Missing gameState, actions, or playerId" });
  }

  try {
    const newState = executeActions(gameState, actions, playerId);
    res.json(newState);
  } catch (err: any) {
    console.error("Execution failed", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/play-turn", (req: Request, res: Response) => {
  const { gameState, actions, playerId } = req.body;
  if (!gameState || !playerId) {
    return res.status(400).json({ error: "Missing gameState or playerId" });
  }

  try {
    const newState = playTurn(gameState, actions || [], playerId); // ✅ Corrected
    res.json(newState);
  } catch (err: any) {
    console.error("Turn processing failed", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🌙 Coven backend listening on port ${PORT}`);
});