import { GameState, MarketItem, CropType } from "../../shared/src/types";

export function applyBuy(
  state: GameState,
  playerId: string,
  item: MarketItem
): GameState {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) throw new Error(`Player with ID ${playerId} not found`);

  const inventoryKey = item.type === "potion" ? item.name : item.type;

  if (item.type === "ingredient" || item.type === "crop") {
    const key = inventoryKey as CropType;
    player.inventory[key] = (player.inventory[key] ?? 0) + 1;
  }

  player.gold -= item.currentPrice ?? item.price;

  return state;
}