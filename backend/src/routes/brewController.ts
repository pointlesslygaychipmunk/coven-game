import { Router, type RequestHandler } from 'express';
import Database from 'better-sqlite3';
import { verifyBrew } from '../brewVerifier';
import recipes from '../../recipes.json' assert { type: 'json' };
import type { BrewMatch3Result, CropType, PotionTier } from '../../../shared/types';
import { gameState } from '../db';

export const brewRouter = Router();
export const db = new Database('coven.db');

const toTier = (q: number): PotionTier =>
  q >= 0.9 ? 'legendary'
  : q >= 0.75 ? 'rare'
  : q >= 0.5 ? 'uncommon'
  : 'common';

const blankIngredients: Record<CropType, number> = {
  mushroom: 0, flower: 0, herb: 0, fruit: 0,
};

const handleBrew: RequestHandler = (req, res) => {
  const { recipeId, seed, moves } = req.body as BrewMatch3Result;
  const meta = recipes[recipeId as keyof typeof recipes];
  if (!meta) return res.status(400).json({ error: 'unknown recipe' });

  const quality = verifyBrew(seed, moves, meta);
  if (quality === 0) return res.status(400).json({ error: 'invalid brew' });

  const pid = req.headers['x-player-id'] as string | undefined;
  const player = gameState.players.find(p => p.id === pid);
  if (!player) return res.status(404).json({ error: 'player not found' });

  player.potions.push({
    id: crypto.randomUUID(),
    name: recipeId,
    tier: toTier(quality),
    ingredients: blankIngredients,
  });

  db.prepare(
    'INSERT INTO potions(playerId,name,tier,quality) VALUES (?,?,?,?)',
  ).run(pid, recipeId, toTier(quality), quality);

  res.json({ ok: true, quality });
};

brewRouter.post('/brew', handleBrew);
export default brewRouter;