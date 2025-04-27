import express from 'express';
import Database from 'better-sqlite3';

import { verifyBrew } from '../brewVerifier';
import recipesJson from '../../recipes.json';

import type {
  BrewMatch3Result,
  PotionTier,
  CropType,
  Recipes
} from '../../../shared/types';

/* ────────── singletons ────────── */

export const db = new Database('coven.db');
export const brewRouter = express.Router();

// temporary in-memory state; swap for real store later
import { gameState } from '../db';

/* JSON → typed map */
const recipes: Recipes = recipesJson as Recipes;

/* ────────── helpers ────────── */

const toTier = (q: number): PotionTier =>
  q >= 0.9  ? 'legendary'
: q >= 0.75 ? 'rare'
: q >= 0.5  ? 'uncommon'
:             'common';

const blankIngredients: Record<CropType, number> = {
  mushroom: 0,
  flower:   0,
  herb:     0,
  fruit:    0
};

/* ────────── route handler ────────── */

const handleBrew: express.RequestHandler = (req, res) => {
  const { recipeId, seed, moves } = req.body as BrewMatch3Result;

  const meta = recipes[recipeId];
  if (!meta) {
    res.status(400).json({ error: 'unknown recipe' });
    return;
  }

  const quality = verifyBrew(seed, moves, meta);
  if (quality === 0) {
    res.status(400).json({ error: 'invalid brew' });
    return;
  }

  const pid    = req.headers['x-player-id'] as string | undefined;
  const player = gameState.players.find(p => p.id === pid);
  if (!player) {
    res.status(404).json({ error: 'player not found' });
    return;
  }

  const tier = toTier(quality);

  player.potions.push({
    id:          crypto.randomUUID(),
    name:        recipeId,
    tier,                              // <- PotionTier literal
    ingredients: { ...blankIngredients }
  });

  db.prepare(
    'INSERT INTO potions (playerId, name, tier, quality) VALUES (?, ?, ?, ?)'
  ).run(pid, recipeId, tier, quality);

  res.json({ ok: true, quality });
};

/* mount once */
brewRouter.post('/brew', handleBrew);