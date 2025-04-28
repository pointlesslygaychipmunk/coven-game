// backend/src/server.ts – Corrected Express server with proper typings
import express, { Request, Response } from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { gameState } from './db';
import createGameState from './createGameState';
import { executeActions } from './executeActions';
import { nextTurn } from './turnEngine';

const app = express();
const HTTP_PORT = 80;
const HTTPS_PORT = 443;
const CERTS_DIR = path.join(__dirname, '..', 'certs');

// Load SSL certificates if available
let credentials: { key: Buffer; cert: Buffer } | null = null;
try {
  credentials = {
    key: fs.readFileSync(path.join(CERTS_DIR, 'privkey.pem')),
    cert: fs.readFileSync(path.join(CERTS_DIR, 'fullchain.pem')),
  };
  console.log('🔒 SSL certificates loaded.');
} catch {
  console.warn('⚠️ No SSL certificates found. Running HTTP only.');
}

// Middleware
app.use(express.json());

// Serve frontend static files
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// API Routes

app.get('/api/state', (req: Request, res: Response) => {
  res.json(gameState);
});

app.post('/api/action', (req: Request, res: Response) => {
  const playerId = req.header('x-player-id') || gameState.players[0].id;
  if (gameState.actionsUsed >= 2) {
    return res.status(400).send('No actions remaining this turn');
  }
  try {
    executeActions(gameState, playerId, [req.body]);
    gameState.actionsUsed += 1;
    res.json(gameState);
  } catch (err) {
    res.status(400).send(String(err));
  }
});

app.post('/api/brew', (req: Request, res: Response) => {
  const playerId = req.header('x-player-id') || gameState.players[0].id;
  const { recipeId, seed, moves } = req.body;
  try {
    executeActions(gameState, playerId, [{ type: 'brew', recipeId, result: { recipeId, seed, moves, quality: 1 } }]);
    res.json(gameState);
  } catch (err) {
    res.status(400).send(String(err));
  }
});

app.post('/api/advance', (req: Request, res: Response) => {
  if (gameState.currentPlayer < gameState.players.length - 1) {
    gameState.currentPlayer += 1;
    gameState.actionsUsed = 0;
  } else {
    nextTurn(gameState);
    gameState.currentPlayer = 0;
    gameState.actionsUsed = 0;
  }
  res.json(gameState);
});

app.post('/api/reset', (req: Request, res: Response) => {
  Object.assign(gameState, createGameState());
  res.json({ ok: true });
});

// Serve frontend app for all unmatched routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Start HTTP and HTTPS servers
http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`☾ HTTP server running on port ${HTTP_PORT}`);
});
if (credentials) {
  https.createServer(credentials, app).listen(HTTPS_PORT, () => {
    console.log(`🌙 HTTPS server running on port ${HTTPS_PORT}`);
  });
}
