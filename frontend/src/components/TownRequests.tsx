import React from 'react';

export interface TownRequestCard {
  id: string;
  potionNeeds: {
    mushroom: number;
    flower: number;
    herb: number;
    fruit: number;
  };
  craftPoints: number;
  boardSlot: 1 | 2 | 3 | 4;
  fulfilled?: boolean;
}

const slotBonuses = {
  1: { gold: 4, renown: 2 },
  2: { gold: 3, renown: 1 },
  3: { gold: 2, renown: -1 },
  4: { gold: 1, renown: -2 },
};

const potionIcons = {
  mushroom: '🍄',
  flower: '🌸',
  herb: '🌿',
  fruit: '🍎',
};

export const TownRequests = ({
  cards,
  onFulfill
}: {
  cards: TownRequestCard[];
  onFulfill: (card: TownRequestCard) => void;
}) => {
  return (
    <div className="p-4 bg-white/70 rounded-xl shadow space-y-2">
      <h3 className="text-lg font-bold">Town Requests</h3>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => {
          const { gold, renown } = slotBonuses[card.boardSlot];

          return (
            <div
              key={card.id}
              className={`rounded-lg p-3 shadow-sm border ${
                card.fulfilled ? 'opacity-50 bg-gray-100' : 'bg-white hover:bg-blue-50'
              } transition`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Slot {card.boardSlot}</span>
                <span className="text-sm font-medium text-purple-700">✨ {card.craftPoints} CP</span>
              </div>
              <div className="my-2 flex flex-wrap gap-2">
                {Object.entries(card.potionNeeds).map(([type, count]) =>
                  count > 0 ? (
                    <div
                      key={type}
                      className="px-2 py-1 text-sm bg-gray-200 rounded-full"
                      title={`${type} potion`}
                    >
                      {potionIcons[type as keyof typeof potionIcons]} × {count}
                    </div>
                  ) : null
                )}
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>💰 {gold} gold</span>
                <span>📈 {renown > 0 ? '+' : ''}{renown} renown</span>
              </div>
              {!card.fulfilled && (
                <button
                  onClick={() => onFulfill(card)}
                  className="mt-2 px-3 py-1 text-sm bg-green-200 hover:bg-green-300 rounded"
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