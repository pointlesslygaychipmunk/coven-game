// very tiny stub – extend with real AI later
import type { GameState, Rumor } from "@shared/types";

export function nextRumor(state: GameState): Rumor | null {
  const pool = [
    "A mysterious trader arrived in town.",
    "The price of herbs is expected to rise.",
    "Strange lights near the old moon-well…",
    "There's a rumor about a hidden treasure.",
    "Plants are growing faster this season.",
    "Reports of will-o'-the-wisps in the woods. Folk say harvests will be bountiful.",
  ];

  return {
    id:        crypto.randomUUID(),
    message:   pool[Math.floor(Math.random() * pool.length)],
    source:    "town",
    timestamp: Date.now(),
  };
}
