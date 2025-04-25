/// <reference types="react" />
import React from "react";
import type {
  BasicMarketItem,
  PotionMarketItem,
  BlackMarketItem,
} from "../../../shared/types";

type MarketItem = BasicMarketItem | PotionMarketItem | BlackMarketItem;

interface MarketProps {
  marketItems: Record<string, MarketItem>;
  onBuy: (itemId: string) => void;
  onSell: (itemId: string) => void;
  onAcquireBlack?: (itemId: string) => void;
}

export const Market: React.FC<MarketProps> = ({
  marketItems,
  onBuy,
  onSell,
  onAcquireBlack,
}) => {
  const emojiMap: Record<string, string> = {
    mushroom: "🍄",
    flower: "🌸",
    herb: "🌿",
    fruit: "🍎",
  };

  const isBasic = (i: MarketItem): i is BasicMarketItem =>
    i.type === "crop" || i.type === "ingredient";
  const isPotion = (i: MarketItem): i is PotionMarketItem =>
    i.type === "potion";
  const isBlack = (i: MarketItem): i is BlackMarketItem =>
    i.type === "blackMarket";

  const basicItems = Object.entries(marketItems).filter(([, i]) =>
    isBasic(i)
  );
  const potionItems = Object.entries(marketItems).filter(([, i]) =>
    isPotion(i)
  );
  const blackItems = Object.entries(marketItems).filter(([, i]) =>
    isBlack(i)
  );

  const renderItem = (
    key: string,
    item: MarketItem,
    actionBtn: React.ReactNode
  ) => {
    const label = isPotion(item)
      ? item.name
      : isBlack(item)
      ? item.name
      : key;
    const tier = isPotion(item) ? `(${item.tier})` : null;
    const risk = isBlack(item) ? `Risk ${item.riskLevel}` : null;
    const price = item.currentPrice ?? item.price;
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
              {label} {tier}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>💰 {price}</span>
            <span>📦 {item.stock}</span>
            {risk && <span className="italic text-xs">{risk}</span>}
            {actionBtn}
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

      {basicItems.length > 0 && (
        <section>
          <h3 className="text-md font-semibold text-purple-500 mb-1">
            🌱 Crops & Ingredients
          </h3>
          <ul className="space-y-2">
            {basicItems.map(([k, i]) =>
              renderItem(
                k,
                i,
                <>
                  <button
                    className="px-2 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300"
                    onClick={() => onBuy(k)}
                  >
                    Buy
                  </button>
                  <button
                    className="px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300"
                    onClick={() => onSell(k)}
                  >
                    Sell
                  </button>
                </>
              )
            )}
          </ul>
        </section>
      )}

      {potionItems.length > 0 && (
        <section>
          <h3 className="text-md font-semibold text-purple-500 mb-1">🧪 Potions</h3>
          <ul className="space-y-2">
            {potionItems.map(([k, i]) =>
              renderItem(
                k,
                i,
                <button
                  className="px-2 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300"
                  onClick={() => onBuy(k)}
                >
                  Buy
                </button>
              )
            )}
          </ul>
        </section>
      )}

      {blackItems.length > 0 && (
        <section>
          <h3 className="text-md font-semibold text-purple-500 mb-1">
            🕸️ Black Market
          </h3>
          <ul className="space-y-2">
            {blackItems.map(([k, i]) =>
              renderItem(
                k,
                i,
                <button
                  className="px-2 py-1 bg-black text-white rounded hover:bg-gray-800"
                  onClick={() => onAcquireBlack?.(k)}
                >
                  Acquire
                </button>
              )
            )}
          </ul>
        </section>
      )}

      {basicItems.length === 0 &&
      potionItems.length === 0 &&
      blackItems.length === 0 && (
        <p className="text-gray-500 italic">No items available.</p>
      )}
    </div>
  );
};