import RuneGrid from "./RuneGrid";
import { Progress } from "@/components/ui";
import { useState, useMemo } from "react";
import type { BrewMove } from "@shared/types";

interface Props {
  seed: string;
  targetScore: number;
  maxMoves: number;
  onChange(score: number, moves: BrewMove[]): void;
}

export default function RuneCrush({
  seed,
  targetScore,
  maxMoves,
  onChange
}: Props) {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState<BrewMove[]>([]);

  const percent = useMemo(
    () => Math.min(100, (score / targetScore) * 100),
    [score, targetScore]
  );

  return (
    <div className="space-y-4">
      <RuneGrid
        seed={seed}
        onChange={(s, m) => {
          setScore(s);
          setMoves(m);
          onChange(s, m);
        }}
      />
      <Progress value={percent} />
      <p className="text-center text-xs text-muted-foreground">
        {score}/{targetScore} • {moves.length}/{maxMoves} moves
      </p>
    </div>
  );
}
