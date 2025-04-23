import React from 'react';

interface GameOverProps {
  score: number;
  breakdown: Record<string, number>;
  lost: boolean;
}

export const GameOver = ({ score, breakdown, lost }: GameOverProps) => {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-stone-300 shadow rounded text-center space-y-4">
      <h1 className="text-3xl font-bold text-rose-700">
        {lost ? 'You Failed the Town' : 'Year Completed!'}
      </h1>
      <p className="text-stone-600 text-lg">
        {lost ? 'Your renown or effort was not enough. Perhaps next year...' : 'You’ve survived a year and grown your craft.'}
      </p>

      <div className="text-left mt-4">
        <h2 className="font-semibold mb-2 text-stone-700">Score Breakdown</h2>
        <ul className="space-y-1 text-sm">
          {Object.entries(breakdown).map(([k, v]) => (
            <li key={k} className="flex justify-between">
              <span className="capitalize">{k.replace(/Points$/, '')}</span>
              <span>+{v}</span>
            </li>
          ))}
        </ul>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{score}</span>
        </div>
      </div>
    </div>
  );
};
