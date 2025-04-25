// components/Market.tsx
import React from "react";
import type {
  MarketItem,
  MarketState,
  PotionMarketItem,
  BasicMarketItem,
} from "../../../shared/types";

export function Market({
  market,
  onBuy,
  onSell,
}: {
  market: MarketState;
  onBuy: (item: string) => void;
  onSell: (item: string) => void;
}) {
  const emojiMap: Record<string, string> = {
    mushroom: "🍄",
    flower: "🌸",
    herb: "🌿",
    fruit: "🍎",
  };

  const isPotionItem = (item: MarketItem): item is PotionMarketItem =>
    item.type === "potion";

  const isBasicItem = (item: MarketItem): item is BasicMarketItem =>
    item.type === "ingredient" || item.type === "crop";

  const cropItems = Object.entries(market ?? {}).filter(([, item]) =>
    isBasicItem(item)
  );

  const potionItems = Object.entries(market ?? {}).filter(([, item]) =>
    isPotionItem(item)
  );

  const renderItem = (key: string, item: MarketItem) => {
    const isPotion = isPotionItem(item);
    const label = isPotion ? item.name : key;
    const tier = isPotion ? item.tier : null;
    const rumor = item.rumors?.[0]?.message;

    return (
      <li
        key={key}
        className="p-3 bg-purple-50 border border-purple-200 rounded shadow-sm hover:bg-purple-100 transition"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">{emojiMap[key] ?? "🧪"}</span>
            <span className="capitalize font-medium text-purple-800">
              {label ?? "Unnamed"}
            </span>
            {tier && (
              <span className="text-xs text-purple-500 italic">({tier})</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>💰 {item.price ?? "?"}</span>
            <span>📦 {item.stock ?? 0}</span>
            <button
              className="px-2 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300"
              onClick={() => onBuy(key)}
            >
              Buy
            </button>
            <button
              className="px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300"
              onClick={() => onSell(key)}
            >
              Sell
            </button>
          </div>
        </div>
        {rumor && (
          <div className="mt-2 ml-8 text-sm italic text-purple-600">
            🗣️ {rumor}
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 border border-purple-200 space-y-5">
      <h2 className="text-lg font-bold text-purple-700">🏬 Market</h2>

      {Array.isArray(cropItems) && cropItems.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-purple-500 mb-1">🌱 Crops</h3>
          <ul className="space-y-2">
            {cropItems.map(([key, item]) => renderItem(key, item))}
          </ul>
        </div>
      )}

      {Array.isArray(potionItems) && potionItems.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-purple-500 mb-1">🧪 Potions</h3>
          <ul className="space-y-2">
            {potionItems.map(([key, item]) => renderItem(key, item))}
          </ul>
        </div>
      )}
    </div>
  );
}