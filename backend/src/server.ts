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

const app = express();

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowed = [
      "https://coven-frontend.onrender.com",
      "null",
    ];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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

app.post("/buy", (req: Request, res: Response) => {
  const { gameState, type } = req.body;
  const updatedState = applyBuy(gameState, type, 1);
  res.json(updatedState);
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

app.post("/play-turn", (req: Request, res: Response) => {
  const currentState = req.body as GameState;
  const newState = playTurn(currentState);
  res.json(newState);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});