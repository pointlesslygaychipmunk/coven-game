import express from 'express';
import type { BrewMatch3Result } from '../../shared/src/types';
import { verifyBrew } from '../brewVerifier';
import recipes from '../recipes.json';

const router = express.Router();

router.post('/brew', (req, res) => {
  const { seed, moves, recipeId }: BrewMatch3Result = req.body;
  const recipeMeta = recipes[recipeId as keyof typeof recipes];
  const quality = verifyBrew(seed, moves, {
    targetScore: recipeMeta.targetScore,
    maxMoves: recipeMeta.maxMoves,
    optimalMoves: recipeMeta.optimalMoves
  });

  res.json({ quality });
});

export default router;
