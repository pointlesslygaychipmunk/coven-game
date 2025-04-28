import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { createInitialGameState, applyGameAction } from './game';
import type { GameState, GameAction } from '@shared/types';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

let gameState: GameState = createInitialGameState();

app.get('/state', (req, res) => {
  res.json(gameState);
});

app.post('/action', (req, res) => {
  const action: GameAction = req.body;
  try {
    const result = applyGameAction(gameState, action);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    gameState = result.state;
    res.json(gameState);
  } catch (err) {
    console.error('Failed to apply action', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/start', (req, res) => {
  gameState = createInitialGameState();
  res.json(gameState);
});

// Ports
const HTTP_PORT = 80;
const ALT_HTTP_PORT = 8080;
const HTTPS_PORT = 443;

// Certificate paths
const certPath = path.resolve(__dirname, '../certs');
const keyFile = path.join(certPath, 'privkey.pem');
const certFile = path.join(certPath, 'fullchain.pem');

// Try to create HTTPS server
try {
  const key = fs.readFileSync(keyFile);
  const cert = fs.readFileSync(certFile);

  const httpsServer = https.createServer({ key, cert }, app);
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`🌙 Coven backend (HTTPS) running at https://localhost:${HTTPS_PORT}`);
  });
} catch (err) {
  console.warn('⚠️  HTTPS certificates not found. Skipping HTTPS setup.');
}

// Always create HTTP servers
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => {
  console.log(`✨ Coven backend (HTTP) running at http://localhost:${HTTP_PORT}`);
});

const altHttpServer = http.createServer(app);
altHttpServer.listen(ALT_HTTP_PORT, () => {
  console.log(`✨ Coven backend (Alt HTTP) running at http://localhost:${ALT_HTTP_PORT}`);
});
