import express from "express";
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

const app = express();
app.use(cors({ origin: "https://coven-frontend.onrender.com" }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "https://coven-frontend.onrender.com" },
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

function isValidationResult(obj: any): obj is { valid: boolean; error?: string; state?: any } {
  return obj && typeof obj === 'object' && 'valid' in obj && typeof obj.valid === 'boolean';
}

app.get("/init", (_req, res) => {
  const initialState = createGameState();
  res.json(initialState);
});

app.post("/harvest", (req, res) => {
  const result = validateHarvest(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/brew", (req, res) => {
  const result = validateBrew(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/fulfill", (req, res) => {
  const { card, gameState } = req.body;
  const result = validateFulfill(card, gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});


app.post("/plant", (req, res) => {
  const { type, index, gameState } = req.body;
  const result = validatePlantCrop(gameState, type, index);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }
  res.json(result.state);
});

app.post("/plant-tree", (req, res) => {
  const { gameState } = req.body;
  const result = validatePlantTree(gameState);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }
  res.json(result.state);
});

app.post("/fell-tree", (req, res) => {
  const { index, gameState } = req.body;
  const result = validateFellTree(index, gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/buy", (req, res) => {
  const result = validateBuy(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/sell", (req, res) => {
  const result = validateSell(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/upgrade", (req, res) => {
  const result = validateUpgrade(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

app.post("/advance", (req, res) => {
  const result = validateAdvance(req.body.gameState);
  if (!isValidationResult(result) || !result.valid) return res.status(400).json({ error: isValidationResult(result) ? result.error : "Invalid request" });
  res.json(result.state);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});