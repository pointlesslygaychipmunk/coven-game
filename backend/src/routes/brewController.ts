import { Router } from "express";
import { verifyBrew } from "../brewVerifier";
import type { BrewMove, BrewMatch3Result, Recipes } from "@shared/types";
import recipesData from "../recipes.json";

const router = Router();

const recipes: Recipes = recipesData as Recipes;

router.post("/", (req, res) => {
  const { recipeId, seed, moves } = req.body;
  if (!recipeId || !seed || !Array.isArray(moves)) {
    return res.status(400).json({ error: "Invalid brew data" });
  }

  const brewMoves: BrewMove[] = moves;
  const recipeMeta = recipes[recipeId] || { targetScore: 300, maxMoves: 10, optimalMoves: 5 };
  const quality = verifyBrew(seed, brewMoves, recipeMeta);

  const result: BrewMatch3Result = {
    recipeId,
    seed,
    moves: brewMoves,
    quality
  };
  return res.json({ result });
});

export default router;
