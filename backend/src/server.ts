import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { loadState, saveState } from './db';
import { setupPlayController } from './playController';
import { executeActions }      from './executeActions';
import { advanceTurn }         from './turnEngine';
import { createGameState }     from './createGameState';
import type { GameState, Action } from '../../shared/types';

const app = express();
app.use(cors());
app.use(express.json());

// load or bootstrap
let state: GameState = loadState() ?? createGameState();

// REST endpoints
app.get(
  '/state',
  (_req: Request, res: Response<GameState>) => {
    res.json(state);
  }
);

app.post(
  '/execute-actions',
  (req: Request<{}, GameState, { playerId: string; actions: Action[] }>, res) => {
    const { playerId, actions } = req.body;
    state = executeActions(state, playerId, actions);
    saveState(state);
    res.json(state);
  }
);

app.post(
  '/play-turn',
  (_req: Request, res: Response<GameState>) => {
    state = advanceTurn(state);
    saveState(state);
    res.json(state);
  }
);

// serve your static frontend
const staticDir = path.join(__dirname, '../frontend/dist');
app.use(express.static(staticDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// socket.io
const server = http.createServer(app);
const io     = new SocketIOServer(server);
setupPlayController(io);

const PORT = parseInt(process.env.PORT || '8080', 10);
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});