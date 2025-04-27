/* ------------------------------------------------------------------
   backend/src/routes/brewRouter.ts
   ------------------------------------------------------------------ */

   import { Router, type RequestHandler } from "express";
   import Database from "better-sqlite3";
   
   import { verifyBrew }   from "../brewVerifier";
   import recipes          from "../../recipes.json";
   
   import type {
     BrewMatch3Result,
     CropType,
     PotionTier,
     RecipeMeta,
     GameState
   } from "@shared/types";
   
   import { gameState } from "../db";
   
   /* ────────────────────────────────────────────────────────────────── */
   
   const db          = new Database("coven.db");
   export const brewRouter = Router();   // exported *after* db so tests can stub
   
   /* ---------- helpers ------------------------------------------------------ */
   
   const toTier = (q: number): PotionTier =>
     q >= 0.90 ? "legendary" :
     q >= 0.75 ? "rare"      :
     q >= 0.50 ? "uncommon"  :
                 "common";
   
   const blankIngredients: Record<CropType, number> = {
     mushroom : 0,
     flower   : 0,
     herb     : 0,
     fruit    : 0
   };
   
   /* ---------- route -------------------------------------------------------- */
   
   const handleBrew: RequestHandler = (req, res): void => {
     /* 1. shape & look-ups */
     const { recipeId, seed, moves } = req.body as BrewMatch3Result;
   
     const meta: RecipeMeta | undefined =
       (recipes as Record<string, RecipeMeta>)[recipeId];
   
     if (!meta)    return void res.status(400).json({ error: "unknown recipe" });
   
     /* 2. verify puzzle */
     const quality = verifyBrew(seed, moves, meta);
     if (quality === 0)
       return void res.status(400).json({ error: "invalid brew" });
   
     /* 3. get player */
     const pid     = req.header("x-player-id") ?? "";
     const player  = (gameState as GameState).players.find(p => p.id === pid);
     if (!player)  return void res.status(404).json({ error: "player not found" });
   
     /* 4. mutate in-memory state */
     player.potions.push({
       id:           crypto.randomUUID(),
       name:         recipeId,
       tier:         toTier(quality),
       ingredients:  { ...blankIngredients }          // keep a fresh object
     });
   
     /* 5. persist */
     db.prepare(`
       INSERT INTO potions (playerId, name, tier, quality)
       VALUES               (?,        ?,    ?,    ?)
     `).run(pid, recipeId, toTier(quality), quality);
   
     /* 6. respond */
     res.json({ ok: true, quality });
   };
   
   brewRouter.post("/brew", handleBrew);
   
   /* preferred single export */
   export default brewRouter;   