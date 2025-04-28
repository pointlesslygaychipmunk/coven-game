import { Router } from "express";
import { verifyBrew } from "../brewVerifier";
import type { BrewMove, BrewMatch3Result, Recipes } from "@shared/types";
import recipesData from "../recipes.json";

const router = Router();

// The recipes.json is typed as a generic object; cast to our Recipes type for indexing
const recipes: Recipes = recipesData as Recipes;

/**
 * API endpoint to verify a brewing result (match-3 puzzle outcome).
 * Expects recipeId, seed, and an array of moves in the request body.
 */
router.post("/brew", (req, res) => {
  const { recipeId, seed, moves } = req.body;
  if (!recipeId || !seed || !Array.isArray(moves)) {
    return res.status(400).json({ error: "Invalid brew data" });
  }

  // Ensure moves are of type BrewMove
  const brewMoves: BrewMove[] = moves;

  // Lookup the target recipe metadata (score goals) or use defaults
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
