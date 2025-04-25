import type { GameState, BlackMarketItem } from "../../../shared/types";

/**
 * Returns all black market items currently available.
 */
export function getBlackMarketItems(
  state: GameState
): Record<string, BlackMarketItem> {
  const entries = Object.entries(state.market.items);
  const filtered = entries.filter(
    (entry): entry is [string, BlackMarketItem] => {
      const item = entry[1];
      return item.type === "blackMarket";
    }
  );

  return filtered.reduce<Record<string, BlackMarketItem>>((acc, [k, item]) => {
    acc[k] = item;
    return acc;
  }, {});
}