/**
 * Random market price drift + rumor generation for a new turn.
 * Only a toy implementation to keep the demo running.
 */
import { MarketRumor, GameState, MarketItem } from "./shared/types";
import { generateRumor }                     from "./generateRumor";

/* ─ helper – apply ±10 % drift ───────────────────────────────── */
function driftPrice(item: MarketItem): void {
  const factor = 1 + (Math.random() * 0.2 - 0.1);          // –10 % … +10 %
  item.price   = Math.max(1, Math.round(item.price * factor));
}

/* ─ main entry ──────────────────────────────────────────────── */
export function applyMarketEvents(state: GameState): void {
  const now = Date.now();

  Object.entries(state.market.items).forEach(([itemId, item]) => {
    driftPrice(item);

    /* replace with three fresh rumors */
    const rumors: MarketRumor[] = Array.from({ length: 3 }, () =>
      generateRumor(item)                                      // id / message
    ).map(r => ({ ...r, timestamp: now, source: "market" }));  // add meta

    item.rumors = rumors;
  });
}
