import { Dialog, DialogContent, DialogHeader } from '@shadcn/ui';
import { Progress } from '@shadcn/ui';
import { useState } from 'react';
import RuneGrid from './RuneGrid';          // your existing puzzle grid
import type { BrewMove } from '../../../shared/src/types';

interface Props {
  open: boolean;
  seed: string;
  recipe: { id: string; targetScore: number; maxMoves: number };
  onClose(): void;
  onSubmit(moves: BrewMove[]): void;
}

export default function BrewDialog({ open, seed, recipe, onClose, onSubmit }: Props) {
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

        <Progress value={(score / recipe.targetScore) * 100} className="mt-4" />
        <p className="text-xs text-center mt-1">
          {score}/{recipe.targetScore} • {moves.length}/{recipe.maxMoves} moves
        </p>
      </DialogContent>
    </Dialog>
  );
}