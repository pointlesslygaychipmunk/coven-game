import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { createInitialGameState, applyGameAction } from './game';
import type { GameState, GameAction } from '@shared/types';

const app = express();
const PORT = 3001;

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

app.listen(PORT, () => {
  console.log(`✨ Coven backend is running on port ${PORT}`);
});
