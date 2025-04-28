import { useState } from "react";
import RuneCrush from "@/components/RuneCrush";
import type { BrewMove, Player } from "@shared/types";

interface PotionPanelProps {
  player: Player;
  onBrew: (recipeId: string) => void;
}

const recipes = [{ id: "moonwell_elixir", name: "Moonwell Elixir" }];

export default function PotionPanel({ player, onBrew }: PotionPanelProps) {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState("");
  const [recipe] = useState(recipes[0]);

  function startPuzzle() {
    setSeed(crypto.randomUUID());
    setOpen(true);
  }

  async function submit(moves: BrewMove[]) {
    await fetch("/api/brew", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-player-id": player.id },
      body: JSON.stringify({ recipeId: recipe.id, seed, moves }),
    });
    setOpen(false);
    onBrew(recipe.id);
  }

  return (
    <div className="p-4 bg-gradient-to-br from-stone-900 via-black to-stone-800 text-stone-200 rounded-xl ethereal-border fade-in-spell">
      <h3 className="text-2xl shimmer-text mb-3">{recipe.name}</h3>
      <button
        onClick={startPuzzle}
        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-sm transition-all"
      >
        Begin Ritual
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur grid place-items-center z-50">
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
