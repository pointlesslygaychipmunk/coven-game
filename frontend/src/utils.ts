/// <reference types="vite/client" />

import type { GameState, Action } from "../../shared/types";

/**
 * Base URL for the API.
 * - In development: VITE_API_URL defaults to "http://localhost:8080"
 * - In production: set VITE_API_URL to your deployed backend, e.g. "https://api.playcoven.com"
 */
const BASE = import.meta.env.VITE_API_URL ?? window.location.origin;

export async function fetchState(): Promise<GameState> {
  const res = await fetch(`${BASE}/state`);
  if (!res.ok) throw new Error(`Fetch state failed: ${res.status}`);
  return res.json();
}

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

export async function advanceTurn(): Promise<GameState> {
  const res = await fetch(`${BASE}/play-turn`, { method: "POST" });
  if (!res.ok) throw new Error(`Advance turn failed: ${res.status}`);
  return res.json();
}