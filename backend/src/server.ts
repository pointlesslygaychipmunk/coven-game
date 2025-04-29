// backend/src/server.ts
// Sets up the Express server and API endpoints for game actions

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { GameHandler } from './gameHandler';
import { GameState } from '@shared/types';

// Create Express app
const app = express();
const gameHandler = new GameHandler();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// API Routes

// Get game state
app.get('/api/state', (req, res) => {
  res.json(gameHandler.getState());
});

// Garden actions
app.post('/api/plant', (req, res) => {
  const { playerId, slotId, seedName } = req.body;
  const newState = gameHandler.plantSeed(playerId, slotId, seedName);
  res.json(newState);
});

app.post('/api/water', (req, res) => {
  const { playerId, success } = req.body;
  const newState = gameHandler.waterPlants(playerId, success);
  res.json(newState);
});

app.post('/api/harvest', (req, res) => {
  const { playerId, slotId } = req.body;
  const newState = gameHandler.harvestPlant(playerId, slotId);
  res.json(newState);
});

// Brewing actions
app.post('/api/brew', (req, res) => {
  const { playerId, ingredients } = req.body;
  // Expect ingredients as an array [ing1Name, ing2Name]
  const newState = gameHandler.brewPotion(playerId, ingredients);
  res.json(newState);
});

// Quest actions
app.post('/api/ritual/progress', (req, res) => {
  const { playerId, ritualId, action, details } = req.body;
  const newState = gameHandler.progressRitual(playerId, ritualId, action, details);
  res.json(newState);
});

app.post('/api/ritual/claim', (req, res) => {
  const { playerId, ritualId } = req.body;
  const newState = gameHandler.claimRitualReward(playerId, ritualId);
  res.json(newState);
});

// Market actions
app.post('/api/market/buy', (req, res) => {
  const { playerId, itemId } = req.body;
  const newState = gameHandler.buyItem(playerId, itemId);
  res.json(newState);
});

app.post('/api/market/sell', (req, res) => {
  const { playerId, itemId } = req.body;
  const newState = gameHandler.sellItem(playerId, itemId);
  res.json(newState);
});

// Black market actions
app.post('/api/blackmarket/access', (req, res) => {
  const { playerId } = req.body;
  const newState = gameHandler.accessBlackMarket(playerId);
  res.json(newState);
});

app.post('/api/blackmarket/buy', (req, res) => {
  const { playerId, itemId, traderId } = req.body;
  const result = gameHandler.buyFromBlackMarket(playerId, itemId, traderId);
  res.json(result);
});

app.get('/api/blackmarket/trends', (req, res) => {
  const { playerId } = req.query;
  const trends = gameHandler.getBlackMarketTrends(playerId as string);
  res.json(trends);
});

// Town request actions
app.post('/api/fulfill', (req, res) => {
  const { playerId, requestId } = req.body;
  const newState = gameHandler.fulfillRequest(playerId, requestId);
  res.json(newState);
});

// Rumor system
app.post('/api/rumor/spread', (req, res) => {
  const { playerId, rumorId } = req.body;
  const newState = gameHandler.spreadRumor(playerId, rumorId);
  res.json(newState);
});

app.post('/api/rumor/create', (req, res) => {
  const { playerId, content, itemName, priceEffect } = req.body;
  const newState = gameHandler.createRumor(playerId, content, itemName, priceEffect);
  res.json(newState);
});

// Game turn management
app.post('/api/end-turn', (req, res) => {
  const { playerId } = req.body;
  const newState = gameHandler.endTurn(playerId);
  res.json(newState);
});

// Save/Load game
app.post('/api/save', (req, res) => {
  const saveData = gameHandler.saveGame();
  res.json({ success: true, saveData });
});

app.post('/api/load', (req, res) => {
  const { saveData } = req.body;
  const success = gameHandler.loadGame(saveData);
  
  if (success) {
    res.json({ success: true, state: gameHandler.getState() });
  } else {
    res.status(400).json({ success: false, message: "Failed to load game data." });
  }
});

// Debug/Admin routes (would be protected in production)
app.post('/api/debug/set-phase', (req, res) => {
  const { phaseName } = req.body;
  const newState = gameHandler.debugSetMoonPhase(phaseName);
  res.json(newState);
});

app.post('/api/debug/set-season', (req, res) => {
  const { season } = req.body;
  const newState = gameHandler.debugSetSeason(season);
  res.json(newState);
});

app.post('/api/debug/give-item', (req, res) => {
  const { playerId, itemName, quantity, quality } = req.body;
  const newState = gameHandler.debugGiveItem(playerId, itemName, quantity, quality);
  res.json(newState);
});

// Serve the frontend SPA for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Start the server
const PORT = process.env.PORT || 8080;
let server: http.Server | https.Server;

// Try to use HTTPS if certificates exist
try {
  // Check for SSL certificates
  const certDir = path.join(__dirname, '../certs');
  const privateKey = fs.readFileSync(path.join(certDir, 'privkey.pem'), 'utf8');
  const certificate = fs.readFileSync(path.join(certDir, 'cert.pem'), 'utf8');
  const ca = fs.readFileSync(path.join(certDir, 'chain.pem'), 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  // Create HTTPS server
  server = https.createServer(credentials, app);
  console.log('🧙 Starting Coven with HTTPS...');
} catch (error) {
  // Fall back to HTTP if certificates not found
  console.log('SSL certificates not found, using HTTP instead.');
  server = http.createServer(app);
}

// Start listening
server.listen(PORT, () => {
  console.log(`🌙 Coven server running on port ${PORT}`);
  console.log(`🌿 Game version: ${gameHandler.getState().version}`);
  
  // Log initial game state for debugging
  const initialState = gameHandler.getState();
  console.log(`🧪 Initial game state: ${initialState.time.season} Y${initialState.time.year}, ${initialState.time.phaseName}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});