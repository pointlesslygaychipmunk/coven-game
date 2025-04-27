// frontend/src/utils.ts

import type { GameState, Action } from "../../shared/src/types";

/** No BASE at all—just talk to the same origin. */
export async function fetchState(): Promise<GameState> {
  const res = await fetch(`/state`);
  if (!res.ok) throw new Error(`Fetch state failed: ${res.status}`);
  return res.json();
}

export async function executeActions(
  playerId: string,
  actions: Action[]
): Promise<GameState> {
  const res = await fetch(`/execute-actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId, actions }),
  });
  if (!res.ok) throw new Error(`Execute actions failed: ${res.status}`);
  return res.json();
}

export async function advanceTurn(): Promise<GameState> {
  const res = await fetch(`/play-turn`, { method: "POST" });
  if (!res.ok) throw new Error(`Advance turn failed: ${res.status}`);
  return res.json();
}