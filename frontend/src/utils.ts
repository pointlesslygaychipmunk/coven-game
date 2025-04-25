// frontend/src/utils.ts

import type { GameState, Action } from "../../shared/types";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

/**
 * Fetch the current GameState over HTTP.
 */
export async function fetchState(): Promise<GameState> {
  const res = await fetch(`${BASE}/state`);
  if (!res.ok) throw new Error(`Fetch state failed: ${res.status}`);
  return res.json();
}

/**
 * Send a batch of actions for the current player.
 */
export async function executeActions(
  playerId: string,
  actions: Action[]
): Promise<GameState> {
  const res = await fetch(`${BASE}/execute-actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId, actions }),
  });
  if (!res.ok) throw new Error(`Execute actions failed: ${res.status}`);
  return res.json();
}

/**
 * Advance the global turn / moon phase.
 */
export async function advanceTurn(): Promise<GameState> {
  const res = await fetch(`${BASE}/play-turn`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Advance turn failed: ${res.status}`);
  return res.json();
}