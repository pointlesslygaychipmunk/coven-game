// frontend/src/components/TownRequests.tsx

import React from "react";
import type { TownRequestCard } from "../../../shared/types";

const slotBonuses = {
  1: { gold: 4, renown: 2, color: "from-emerald-200 to-green-100" },
  2: { gold: 3, renown: 1, color: "from-blue-200 to-indigo-100" },
  3: { gold: 2, renown: -1, color: "from-yellow-100 to-orange-100" },
  4: { gold: 1, renown: -2, color: "from-red-200 to-pink-100" },
};

const potionIcons: Record<string, string> = {
  mushroom: "🍄",
  flower: "🌸",
  herb: "🌿",
  fruit: "🍎",
};

interface TownRequestsProps {
  cards: TownRequestCard[];
  onFulfill: (requestId: string) => void;
}

export const TownRequests: React.FC<TownRequestsProps> = ({
  cards,
  onFulfill,
}) => {
  if (!cards?.length) return null;

  return (
    <div className="p-4 bg-white/70 rounded-xl shadow space-y-3">
      <h3 className="text-lg font-bold text-purple-700">📜 Town Requests</h3>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => {
          const { gold, renown, color } = slotBonuses[card.boardSlot];
          const isFulfilled = card.fulfilled;

          return (
            <div
              key={card.id}
              className={`rounded-xl p-3 border bg-gradient-to-br ${color} ${
                isFulfilled
                  ? "opacity-40 line-through"
                  : "hover:ring-2 hover:ring-purple-400"
              } shadow-md transition-all`}
            >
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="italic text-gray-700">
                  Slot {card.boardSlot}
                </span>
                <span className="text-purple-800 font-semibold">
                  ✨ {card.craftPoints} CP
                </span>
              </div>

              <p className="text-sm mb-2">{card.description}</p>

              <div className="my-2 flex flex-wrap gap-1">
                {Object.entries(card.potionNeeds).map(
                  ([type, count]) =>
                    count > 0 && (
                      <div
                        key={type}
                        className="px-2 py-1 bg-white/70 text-sm rounded-full border border-white/60 shadow"
                        title={`${count} ${type} potion${
                          count > 1 ? "s" : ""
                        }`}
                      >
                        {potionIcons[type] ?? "🧪"} × {count}
                      </div>
                    )
                )}
              </div>

              <div className="flex justify-between text-sm mt-2 text-gray-800">
                <span>💰 {gold}</span>
                <span>
                  📈 {renown > 0 ? "+" : ""}
                  {renown} renown
                </span>
              </div>

              {!isFulfilled && (
                <button
                  onClick={() => onFulfill(card.id)}
                  className="mt-2 w-full py-1 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded shadow"
                >
                  Fulfill
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};