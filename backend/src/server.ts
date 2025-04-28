import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import type { GameState, GameAction } from '../../shared/src/types';
import { createInitialGameState, applyGameAction } from './game';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Single game state for now (could handle multiple matches in future)
let gameState: GameState = createInitialGameState();

// Endpoint to fetch current game state
app.get('/state', (req, res) => {
  res.json(gameState);
});

// Endpoint to perform a game action
app.post('/action', (req, res) => {
  const action: GameAction = req.body;
  try {
    // Only apply if game is ongoing
    if (gameState.status.status !== 'ongoing') {
      return res.status(400).json({ error: 'Game has ended.' });
    }
    // Validate correct player turn for turn-based actions (except some allowed anytime)
    if (action.playerId !== gameState.status.currentPlayer && action.type !== 'brew' && action.type !== 'startRumor') {
      return res.status(400).json({ error: 'Not your turn.' });
    }
    // Apply the action to update game state
    const result = applyGameAction(gameState, action);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    gameState = result.state;
    // Respond with the updated game state
    res.json(gameState);
  } catch (err) {
    console.error('Error applying action:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Optionally, endpoint to start a new game (for resetting/testing)
app.post('/start', (req, res) => {
  gameState = createInitialGameState();
  res.json(gameState);
});

app.listen(PORT, () => {
  console.log(`✨ Coven backend server is running on port ${PORT}`);
});
