// components/Market.tsx
import React from "react";
import type {
  MarketItem,
  MarketState,
  BasicMarketItem,
  PotionMarketItem,
} from "../../../shared/types";

interface MarketProps {
  market: MarketState | undefined | null;
  onBuy: (item: string) => void;
  onSell: (item: string) => void;
}

export const Market: React.FC<MarketProps> = ({ market, onBuy, onSell }) => {
  if (!market?.items || typeof market.items !== "object") {
    return (
      <div className="bg-white border border-red-300 text-red-600 px-4 py-3 rounded shadow">
        ⚠️ Market data unavailable. Try ending the turn or refreshing.
      </div>
    );
  }

  const items = market.items;

  const emojiMap: Record<string, string> = {
    mushroom: "🍄",
    flower: "🌸",
    herb: "🌿",
    fruit: "🍎",
  };

  const isPotion = (item: MarketItem): item is PotionMarketItem =>
    item.type === "potion";

  const isBasic = (item: MarketItem): item is BasicMarketItem =>
    item.type === "crop" || item.type === "ingredient";

  const cropItems = Object.entries(items).filter(([, item]) => isBasic(item));
  const potionItems = Object.entries(items).filter(([, item]) => isPotion(item));

  const renderItem = (key: string, item: MarketItem) => {
    const label = isPotion(item) ? item.name : key;
    const tier = isPotion(item) ? item.tier : null;
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
              {label}
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

      {cropItems.length > 0 && (
        <section>
          <h3 className="text-md font-semibold text-purple-500 mb-1">🌱 Crops</h3>
          <ul className="space-y-2">
            {cropItems.map(([key, item]) => renderItem(key, item))}
          </ul>
        </section>
      )}

      {potionItems.length > 0 && (
        <section>
          <h3 className="text-md font-semibold text-purple-500 mb-1">🧪 Potions</h3>
          <ul className="space-y-2">
            {potionItems.map(([key, item]) => renderItem(key, item))}
          </ul>
        </section>
      )}

      {cropItems.length === 0 && potionItems.length === 0 && (
        <p className="text-gray-500 italic">No items available for sale.</p>
      )}
    </div>
  );
};