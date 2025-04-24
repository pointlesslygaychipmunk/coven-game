import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  validatePlantCrop,
  validateHarvest,
  validateBrew,
  validateFulfill,
  validatePlantTree,
  validateFellTree,
  validateBuy,
  validateSell,
  validateUpgrade,
  validateAdvance
} from "./validate";
import { createGameState } from "./createGameState";
import { playTurn } from "./playController";
import type { GameState } from "../../shared/types";
import { applyBuy } from "./applyBuy";
import { executeActions } from "./executeActions";

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
app.options("*", cors(corsOptions));
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

app.get("/ping", (_req: Request, res: Response) => {
  res.json({ message: "pong" });
});

function isValidationResult(obj: any): obj is { valid: boolean; error?: string; state?: any } {
  return obj && typeof obj === 'object' && 'valid' in obj && typeof obj.valid === 'boolean';
}

app.get("/init", (_req: Request, res: Response) => {
  const initialState = createGameState();
  res.json(initialState);
});

app.post("/harvest", (req: Request, res: Response) => {
  const result = validateHarvest(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/brew", (req: Request, res: Response) => {
  const result = validateBrew(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/fulfill", (req: Request, res: Response) => {
  const { card, gameState } = req.body;
  const result = validateFulfill(card, gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/plant", (req: Request, res: Response) => {
  const { type, index, gameState } = req.body;
  const result = validatePlantCrop(gameState, type, index);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }
  res.json(result.state);
});

app.post("/plant-tree", (req: Request, res: Response) => {
  const { gameState } = req.body;
  const result = validatePlantTree(gameState);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }
  res.json(result.state);
});

app.post("/fell-tree", (req: Request, res: Response) => {
  const { index, gameState } = req.body;
  const result = validateFellTree(index, gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/buy", (req, res) => {
  const { itemType, gameState, quantity = 1 } = req.body;

  if (!itemType || !gameState) {
    return res.status(400).json({ error: "Missing itemType or gameState" });
  }

  try {
    const newState = applyBuy(gameState, itemType, quantity);
    res.json(newState);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    res.status(500).json({ error: message });
  }  
});

app.post("/sell", (req: Request, res: Response) => {
  const result = validateSell(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/upgrade", (req: Request, res: Response) => {
  const result = validateUpgrade(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/advance", (req: Request, res: Response) => {
  const result = validateAdvance(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/execute-actions", (req, res) => {
  const { gameState, actions } = req.body;
  const newState = executeActions(gameState, actions);
  res.json(newState);
});

app.post("/play-turn", (req, res) => {
  const { gameState, actions } = req.body;

  if (!gameState || !actions) {
    return res.status(400).json({ error: "Missing gameState or actions" });
  }

  try {
    const updated = playTurn(gameState, actions);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});