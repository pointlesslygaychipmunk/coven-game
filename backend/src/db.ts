// backend/src/db.ts – Database setup and game state storage
import Database from 'better-sqlite3';
import type { GameState } from '../../shared/src/types';
import createGameState from './createGameState';

export const db = new Database('coven.db');        // SQLite database (not actively used in this alpha)
export const gameState: GameState = createGameState();  // global game state object
