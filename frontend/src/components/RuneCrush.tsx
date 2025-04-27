/* src/components/RuneCrush.tsx */
import { useState } from "react";
import RuneGrid from "./RuneGrid";
import type { BrewMove } from "@shared/types";

interface Props {
  seed: string;
  target: number;
  maxMoves: number;
  onFinish(moves: BrewMove[], score: number): void;
}

export default function RuneCrush({ seed, target, maxMoves, onFinish }: Props) {
  const [score,  setScore]  = useState(0);
  const [moves,  setMoves]  = useState<BrewMove[]>([]);

  return (
    <section className="space-y-4">
      <RuneGrid
        seed={seed}
        onChange={(s, m) => {
          setScore(s);
          setMoves(m);
          if (s >= target || m.length >= maxMoves) onFinish(m, s);
        }}
      />

      <div className="text-center text-sm">
        {score}/{target} • {moves.length}/{maxMoves} moves
      </div>
    </section>
  );
}