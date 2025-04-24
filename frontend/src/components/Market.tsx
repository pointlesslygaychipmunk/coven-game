// components/Market.tsx
import React from "react";
import type { GameState } from "../../../shared/types";

export function Market({ market, onBuy, onSell }: {
  market: GameState["market"];
  onBuy: (item: string) => void;
  onSell: (item: string) => void;
}) {
  const potionEmojis: Record<string, string> = {
    mushroom: "🍄",
    flower: "🌸",
    herb: "🌿",
    fruit: "🍎",
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 border border-purple-200">
      <h2 className="text-lg font-bold text-purple-700 mb-3">🏬 Market</h2>
      <ul className="space-y-2">
        {Object.entries(market).map(([item, { stock, price }]) => (
          <li
            key={item}
            className="flex items-center justify-between p-2 bg-purple-50 rounded hover:bg-purple-100 transition"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{potionEmojis[item] ?? "🧪"}</span>
              <span className="capitalize font-medium text-purple-800">{item}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">💰 {price}</span>
              <span className="text-sm text-gray-600">📦 {stock}</span>
              <button
                className="px-2 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300"
                onClick={() => onBuy(item)}
              >
                Buy
              </button>
              <button
                className="px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300"
                onClick={() => onSell(item)}
              >
                Sell
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}