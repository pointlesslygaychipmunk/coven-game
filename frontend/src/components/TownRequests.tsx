import type { TownRequestCard } from '@shared/types';

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

export default function TownRequests({ cards, onFulfill }: TownRequestsProps) {
  if (!cards?.length) return null;

  return (
    <div className="p-4 bg-gradient-to-br from-black via-stone-800 to-black text-stone-200 rounded-xl ethereal-border fade-in-spell space-y-4">
      <h3 className="text-2xl shimmer-text mb-2">📜 Town Requests</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(card => {
          const { gold, renown, color } = slotBonuses[card.boardSlot];
          const isFulfilled = card.fulfilled;

          return (
            <div
              key={card.id}
              className={`rounded-xl p-4 bg-gradient-to-br ${color} ${
                isFulfilled
                  ? "opacity-40 line-through"
                  : "hover:ring-2 hover:ring-emerald-400 transition"
              } ethereal-border`}
            >
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="italic text-stone-700">Slot {card.boardSlot}</span>
                <span className="text-emerald-800 font-semibold">✨ {card.craftPoints} CP</span>
              </div>

              <p className="text-sm mb-2">{card.description}</p>

              <div className="my-2 flex flex-wrap gap-2">
                {Object.entries(card.potionNeeds).map(([type, count]) =>
                  count > 0 ? (
                    <div
                      key={type}
                      className="px-2 py-1 bg-white/80 text-sm rounded-full border border-white/60 shadow"
                      title={`${count} ${type} potion${count > 1 ? "s" : ""}`}
                    >
                      {potionIcons[type] ?? "🧪"} × {count}
                    </div>
                  ) : null
                )}
              </div>

              <div className="flex justify-between text-sm mt-3 text-stone-800">
                <span>💰 {gold}</span>
                <span>📈 {renown > 0 ? "+" : ""}{renown} renown</span>
              </div>

              {!isFulfilled && (
                <button
                  onClick={() => onFulfill(card.id)}
                  className="mt-3 w-full py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded shadow"
                >
                  Fulfill Request
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
