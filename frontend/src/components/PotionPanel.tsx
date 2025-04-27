import { useState } from 'react';
import { RuneCrush } from './RuneCrush';
import type { BrewMove } from '../../../shared/types';
import React from 'react';
import type { Player } from '../../../shared/types';

interface PotionPanelProps {
  player: Player;
  onBrew: (recipeId: string) => void;
}

const PotionPanel: React.FC<PotionPanelProps> = ({ player, onBrew }) => {

const recipes = [{ id: 'moonwell_elixir', name: 'Moonwell Elixir' }];

const [open, setOpen]   = useState(false);
const [seed, setSeed]   = useState('');
const [recipe]          = useState(recipes[0]);

  function startPuzzle() {
    setSeed(crypto.randomUUID());
    setOpen(true);
  }
  async function submit(moves: BrewMove[]) {
    await fetch('/api/brew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-player-id': 'dev' },
      body:   JSON.stringify({ recipeId: recipe.id, seed, moves })
    });
    setOpen(false);
  }

  return (
    <div className="p-4 bg-stone-800/60 rounded">
      <h3 className="text-lg mb-2">{recipe.name}</h3>
      <button onClick={startPuzzle}
              className="px-3 py-1 bg-emerald-500 rounded">Brew</button>

      {open && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center">
          <RuneCrush
            recipeId={recipe.id}
            seed={seed}
            targetScore={500}
            maxMoves={25}
            onSubmit={submit}
          />
        </div>
      )}
    </div>
  );
}

export default PotionPanel;