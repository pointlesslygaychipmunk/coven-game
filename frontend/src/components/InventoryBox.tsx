// backend/src/server.ts
import express from "express";
import fs from "fs";
import https from "https";
import http from "http";
import path from "path";
import cors from "cors";

import { GameHandler } from "./gameHandler";

const app = express();
const gameHandler = new GameHandler();

// Express Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/state", (req, res) => {
  const state = gameHandler.getState();
  res.json(state);
});

app.post("/api/plant", (req, res) => {
  const { playerId, slotId, seedName } = req.body;
  const result = gameHandler.engine.plantSeed(playerId, slotId, seedName);
  res.json(result);
});

app.post("/api/water", (req, res) => {
  const { playerId, success } = req.body;
  const result = gameHandler.engine.waterPlants(playerId, success);
  res.json(result);
});

app.post("/api/brew", (req, res) => {
  const { playerId, ingredients } = req.body;
  const result = gameHandler.engine.brewPotion(playerId, ingredients);
  res.json(result);
});

app.post("/api/endturn", (req, res) => {
  const { playerId, wateringSuccess } = req.body;
  const result = gameHandler.engine.endTurn(playerId, wateringSuccess);
  res.json(result);
});

// Serve frontend files
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));
app.get("*", (_, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Server Config
const PORT_HTTP = 80;
const PORT_HTTPS = 443;
const CERT_DIR = path.join(__dirname, "../certs");

const httpsOptions = {
  key: fs.existsSync(path.join(CERT_DIR, "privkey.pem"))
    ? fs.readFileSync(path.join(CERT_DIR, "privkey.pem"))
    : undefined,
  cert: fs.existsSync(path.join(CERT_DIR, "cert.pem"))
    ? fs.readFileSync(path.join(CERT_DIR, "cert.pem"))
    : undefined,
  ca: fs.existsSync(path.join(CERT_DIR, "fullchain.pem"))
    ? fs.readFileSync(path.join(CERT_DIR, "fullchain.pem"))
    : undefined,
};

// Start HTTPS Server if certs are valid
if (httpsOptions.key && httpsOptions.cert && httpsOptions.ca) {
  https.createServer(httpsOptions, app).listen(PORT_HTTPS, () => {
    console.log("🌙 Coven server listening on HTTPS port 443 🌙");
  });
} else {
  console.warn("⚠️ SSL certs not found. HTTPS not enabled.");
}

// Start fallback HTTP Server
http.createServer(app).listen(PORT_HTTP, () => {
  console.log("🌙 Coven server listening on HTTP port 80 🌙");
});
