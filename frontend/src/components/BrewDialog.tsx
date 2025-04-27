import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogFooter,
 } from "@/components/ui/dialog";
import { useState } from 'react';
import RuneCrush from "@/components/RuneCrush";
import type { BrewMove } from '../../../shared/src/types';

interface Props {
  open: boolean;
  seed: string;
  recipe: { id: string; targetScore: number; maxMoves: number };
  onClose(): void;
  onSubmit(moves: BrewMove[]): void;
}

export default function BrewDialog({
  open,
  seed,
  recipe,
  onClose,
  onSubmit
}: Props) {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState<BrewMove[]>([]);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>Brew – {recipe.id}</DialogHeader>

        <RuneGrid
          seed={seed}
          onChange={(s, m) => {
            setScore(s);
            setMoves(m);

            if (s >= recipe.targetScore || m.length >= recipe.maxMoves)
              onSubmit(m);
          }}
        />

        <div className="mt-3 text-center text-sm">
          {score}/{recipe.targetScore} • {moves.length}/{recipe.maxMoves} moves
        </div>
      </DialogContent>
    </Dialog>
  );
}