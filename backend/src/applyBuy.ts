import type { GameState, MarketItem, Player } from "@shared/types";

export function applyBuy(state: GameState, playerId: string, itemId: string, quantity: number): GameState {
  const player = state.players.find(p => p.id === playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  const item = state.market.items[itemId];
  if (!item) throw new Error(`Item ${itemId} not found`);

  const price = item.currentPrice ?? item.price;
  player.gold -= price * quantity;

  if (item.type === "crop" || item.type === "ingredient") {
    player.inventory[itemId as keyof typeof player.inventory] = (player.inventory[itemId as keyof typeof player.inventory] ?? 0) + quantity;
  } else if (item.type === "potion") {
    for (let i = 0; i < quantity; i++) {
      player.potions.push({
        id: `${itemId}-${Date.now()}-${i}`,
        name: item.name,
        tier: item.tier,
        ingredients: { mushroom: 0, flower: 0, herb: 0, fruit: 0 }
      });
    }
  }

  item.stock -= quantity;
  return state;
}
