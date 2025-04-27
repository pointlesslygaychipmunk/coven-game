/* src/components/BrewDialog.tsx */
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@ui/dialog";
import { Progress } from "@ui/progress";
import { useState } from "react";
import RuneGrid from "./RuneGrid";
import type { BrewMove } from "@shared/types";

interface Props {
  open: boolean;
  recipe: { id: string; targetScore: number; maxMoves: number };
  seed: string;
  onClose(): void;
  onChange={(s: number, m: BrewMove[]) => {
}

export default function BrewDialog({ open, seed, recipe, onClose, onSubmit }: Props) {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState<BrewMove[]>([]);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader className="mb-2 text-center text-lg font-semibold">
          Brew&nbsp;–&nbsp;{recipe.id}
        </DialogHeader>

        <RuneGrid
          seed={seed}
          onChange={(s, m) => {
            setScore(s);
            setMoves(m);
            if (s >= recipe.targetScore || m.length >= recipe.maxMoves) onSubmit(m);
          }}
        />

        <div className="mt-4 space-y-1">
          <Progress value={(score / recipe.targetScore) * 100} />
          <p className="text-center text-xs text-layer-11">
            {score}/{recipe.targetScore} • {moves.length}/{recipe.maxMoves} moves
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}