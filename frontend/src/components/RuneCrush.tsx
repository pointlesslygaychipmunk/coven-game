import { useState } from "react";
import classNames from "@ui/utils";
import type { BrewMove } from "@shared/types";
import RuneGrid from "./RuneGrid";

type Props = {
  recipeId: string;
  seed: string;
  targetScore: number;
  maxMoves: number;
  onSubmit(moves: BrewMove[]): Promise<void>;
};

export default function RuneCrush({
  recipeId,
  seed,
  targetScore,
  maxMoves,
  onSubmit,
}: Props) {
  const [moves, setMoves] = useState<BrewMove[]>([]);
  const [score, setScore] = useState(0);

  return (
    <section
      aria-label={`Rune-Crush brewing puzzle for ${recipeId}`}
      className={classNames(
        "bg-stone-900 rounded-2xl shadow-xl ring-1 ring-emerald-400/20",
        "w-[min(95vw,32rem)] p-8 grid gap-5 fade-in-spell"
      )}
    >
      <RuneGrid
        seed={seed}
        onChange={(s, m) => {
          setScore(s);
          setMoves(m);
          if (s >= targetScore || m.length >= maxMoves) onSubmit(m);
        }}
      />
      <progress
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={targetScore}
        value={score}
        className="w-full accent-emerald-400 h-2 rounded"
      />
      <p className="text-xs text-center text-stone-400">
        {score}/{targetScore} • {moves.length}/{maxMoves} moves
      </p>
    </section>
  );
}
