// frontend/src/utils.ts

import type { GameState } from "../../shared/types";

/**
 * POST to the Coven API and update the game state.
 */
export async function postUpdate(
  endpoint: string,
  payload: any,
  setGameState: (state: GameState) => void
): Promise<void> {
  try {
    const res = await fetch(`https://api.telecrypt.xyz/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data: GameState = await res.json();
    setGameState(data);
  } catch (err) {
    console.error(`${endpoint} error:`, err);
  }
}