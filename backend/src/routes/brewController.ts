import { Router, type RequestHandler } from "express";
import Database                         from "better-sqlite3";
import { verifyBrew }                   from "../brewVerifier";
import recipesJson                      from "../../recipes.json";
import { gameState }                    from "../db";

import type {
  BrewMatch3Result,
  CropType,
  PotionTier
} from "@shared/types";

/* helpers ─────────────────────────────────────────────────────── */
const toTier = (q: number): PotionTier =>
  q >= 0.9  ? "legendary" :
  q >= 0.75 ? "rare"      :
  q >= 0.5  ? "uncommon"  : "common";

const blank: Record<CropType, number> = {
  mushroom: 0, flower: 0, herb: 0, fruit: 0,
};

/* router ──────────────────────────────────────────────────────── */
export const brewRouter = Router();
export const db         = new Database("coven.db");

/* handler ─────────────────────────────────────────────────────── */
const handleBrew: RequestHandler = (req, res): void => {
  const { recipeId, seed, moves } = req.body as BrewMatch3Result;
  const meta = (recipesJson as any)[recipeId];
  if (!meta) {
    res.status(400).json({ error: "unknown recipe" });
    return;
  }

  const quality = verifyBrew(seed, moves, meta);
  if (quality === 0) {
    res.status(400).json({ error: "invalid brew" });
    return;
  }

  const pid    = req.headers["x-player-id"] as string | undefined;
  const player = gameState.players.find(p => p.id === pid);
  if (!player) {
    res.status(404).json({ error: "player not found" });
    return;
  }

  player.potions.push({
    id:          crypto.randomUUID(),
    name:        recipeId,
    tier:        toTier(quality),
    ingredients: blank,
  });

  db.prepare(
    "INSERT INTO potions(playerId,name,tier,quality) VALUES (?,?,?,?)"
  ).run(pid, recipeId, toTier(quality), quality);

  res.json({ ok: true, quality });
};

brewRouter.post("/brew", handleBrew);
export default brewRouter;
