// backend/src/server.ts

import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import { exec } from 'child_process';
import { loadState, saveState } from './db';
import { setupPlayController } from './playController';
import { executeActions } from './executeActions';
import { advanceTurn } from './turnEngine';
import { createGameState } from './createGameState';
import type { GameState, Action } from '../../shared/types';
import { brewRouter } from './routes/brewController';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', brewRouter);

// ——————————————————————————————————————————————
// Load existing state or bootstrap a new one
// ——————————————————————————————————————————————
let state: GameState = loadState() ?? createGameState();

// ——————————————————————————————————————————————
// GitHub Webhook → Auto-Deploy
// ——————————————————————————————————————————————
app.post('/webhook', (req: Request, res: Response) => {
  // Optionally verify req.headers['x-github-event'] === 'push'
  console.info('🔔 GitHub webhook triggered:', req.headers['x-github-event']);

  // Run your deploy pipeline: pull, install, build, restart service
  exec(
    [
      `cd ${path.resolve(__dirname, '..')}`,
      'git pull origin main',
      'npm install',
      'npm run build',
      'nssm restart CovenGame'
    ].join(' && '),
    (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Deploy error:', err);
      }
      if (stdout) console.log('📦 Deploy stdout:', stdout);
      if (stderr) console.error('⚠️ Deploy stderr:', stderr);
    }
  );

  // Reply 200 so GitHub stops retrying
  res.sendStatus(200);
});

// ——————————————————————————————————————————————
// REST API Endpoints
// ——————————————————————————————————————————————
app.get('/state', (_req: Request, res: Response<GameState>) => {
  res.json(state);
});

app.post(
  '/execute-actions',
  (
    req: Request<{}, GameState, { playerId: string; actions: Action[] }>,
    res: Response<GameState>
  ) => {
    const { playerId, actions } = req.body;
    state = executeActions(state, playerId, actions);
    saveState(state);
    res.json(state);
  }
);

app.post('/play-turn', (_req: Request, res: Response<GameState>) => {
  state = advanceTurn(state);
  saveState(state);
  res.json(state);
});

// ——————————————————————————————————————————————
// Serve Static Frontend
// ——————————————————————————————————————————————
const staticDir = path.join(__dirname, '../frontend/dist');
app.use(express.static(staticDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// ——————————————————————————————————————————————
// Socket.IO for Real-Time Updates
// ——————————————————————————————————————————————
const server = http.createServer(app);
const io = new IOServer(server);
setupPlayController(io);

// ——————————————————————————————————————————————
// Start Server
// ——————————————————————————————————————————————
const PORT = parseInt(process.env.PORT || '8080', 10);
server.listen(PORT, () => {
  console.log(`☾ Server listening on port ${PORT}`);
});