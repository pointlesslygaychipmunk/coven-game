import { Router } from "express";
import createGameState from "./createGameState";

export const playRouter = Router();

/* demo route that resets state */
playRouter.post("/reset", (_, res) => {
  Object.assign(require("./db").gameState, createGameState());
  res.json({ ok: true });
});