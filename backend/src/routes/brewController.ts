import express from 'express';
import { verifyBrew } from '../brewVerifier';
import type { BrewMatch3Result } from '../../shared/types';
import { recipes } from '../recipes';   // assume you load JSON metadata here
import { gameState } from '../db';      // your singleton store

export const brewRouter = express.Router();

brewRouter.post('/brew', (req, res) => {
  const { recipeId, seed, moves } = req.body as BrewMatch3Result;
  const meta = recipes[recipeId];
  if (!meta) return res.status(400).json({ error: 'unknown recipe' });

  const quality = verifyBrew(seed, moves, meta);
  if (quality === 0) return res.status(400).json({ error: 'invalid brew' });

  // mutate player inventory (pseudo-code)
  const player = gameState.players.find(p => p.id === req.headers['x-player-id']);
  player.potions.push({ name: recipeId, tier: qualityToTier(quality), ingredients: [] });

  res.json({ ok: true, quality });
});

function qualityToTier(q: number) {
  if (q >= 0.9) return 'legendary';
  if (q >= 0.75) return 'rare';
  if (q >= 0.5) return 'uncommon';
  return 'common';
}