// backend/src/routes/stateController.ts
import { Router } from "express";
import { gameState } from "../db";            // wherever you keep it

export const stateRouter = Router();

stateRouter.get("/state", (_req, res) => {
  res.json(gameState);                        // MUST contain tiles & inventory
});
