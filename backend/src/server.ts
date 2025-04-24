// backend/src/server.ts

import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { createGameState } from "./createGameState";
import { playTurn } from "./playController";
import { executeActions } from "./executeActions";

import {
  validatePlantCrop,
  validatePlantTree,
  validateHarvest,
  validateBrew,
  validateFulfill,
  validateFellTree,
  validateBuy,
  validateSell,
  validateUpgrade,
  validateAdvance
} from "./validate";

import type { GameState, GardenSlot } from "../../shared/types";

const app = express();

const corsOptions = {
  origin: [
    "https://playcoven.com",
    "https://coven-frontend.onrender.com",
    "http://localhost:5173",
    "null",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.options("*", (_req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.sendStatus(204);
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "https://coven-frontend.onrender.com" },
});

// Utility to validate result shape
function isValidationResult(obj: any): obj is { valid: boolean; error?: string; state?: any } {
  return obj && typeof obj === "object" && "valid" in obj;
}

app.get("/ping", (_req: Request, res: Response) => {
  res.json({ message: "pong" });
});

app.get("/init", (_req: Request, res: Response) => {
  const initialState = createGameState();
  res.json(initialState);
});

app.post("/plant", (req: Request, res: Response) => {
  const { type, index, gameState } = req.body;
  const result = validatePlantCrop(gameState, type, index);
  if (!result.valid) return res.status(400).json({ error: result.error });
  res.json(result.state);
});

app.post("/plant-tree", (req: Request, res: Response) => {
  const { gameState, index } = req.body;
  const result = validatePlantTree(gameState, index);
  if (!result.valid) return res.status(400).json({ error: result.error });
  res.json(result.state);
});

app.post("/harvest", (req: Request, res: Response) => {
  const result = validateHarvest(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: result?.error || "Invalid harvest" });
  res.json(result.state);
});

app.post("/brew", (req: Request, res: Response) => {
  const result = validateBrew(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: result?.error || "Invalid brew" });
  res.json(result.state);
});

app.post("/fulfill", (req: Request, res: Response) => {
  const { card, gameState } = req.body;
  const result = validateFulfill(gameState, card);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: result?.error || "Invalid fulfill" });
  res.json(result.state);
});

app.post("/fell-tree", (req: Request, res: Response) => {
  const { index, gameState } = req.body;
  const result = validateFellTree(gameState, index);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: result?.error || "Invalid fell" });
  res.json(result.state);
});

app.post("/buy", (req: Request, res: Response) => {
  const { gameState, item } = req.body;
  const result = validateBuy(gameState, item);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: result?.error || "Invalid buy" });
  res.json(result.state);
});

app.post("/sell", (req: Request, res: Response) => {
  const { gameState, item } = req.body;
  const result = validateSell(gameState, item);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: result?.error || "Invalid sell" });
  res.json(result.state);
});

app.post("/upgrade", (req: Request, res: Response) => {
  const { gameState, upgradeId } = req.body;
  const result = validateUpgrade(gameState, upgradeId);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: result?.error || "Invalid upgrade" });
  res.json(result.state);
});

app.post("/advance", (req: Request, res: Response) => {
  const result = validateAdvance(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: result?.error || "Invalid advance" });
  res.json(result.state);
});

app.post("/execute-actions", (req: Request, res: Response) => {
  const { gameState, actions } = req.body;
  if (!gameState || !actions) return res.status(400).json({ error: "Missing gameState or actions" });

  try {
    const newState = executeActions(gameState, actions);
    res.json(newState);
  } catch (err: any) {
    console.error("Execution failed", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/play-turn", (req: Request, res: Response) => {
  const { gameState, actions } = req.body;
  if (!gameState) return res.status(400).json({ error: "Missing gameState" });

  try {
    const newState = playTurn(gameState, actions || []);
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