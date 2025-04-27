import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@ui/dialog'
import { Progress } from '@ui/progress'
import RuneGrid from './RuneGrid'
import { useState } from 'react'
import type { BrewMove } from '@shared/types'

interface Props {
  open: boolean
  seed: string
  recipe: { id: string; targetScore: number; maxMoves: number }
  onClose(): void
  onSubmit(moves: BrewMove[]): void
}

export default function BrewDialog({
  open,
  seed,
  recipe,
  onClose,
  onSubmit,
}: Props) {
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState<BrewMove[]>([])

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogTitle>Brew — {recipe.id}</DialogTitle>

        <RuneGrid
          seed={seed}
          onChange={(s, m) => {
            setScore(s)
            setMoves(m)
            if (s >= recipe.targetScore || m.length >= recipe.maxMoves) onSubmit(m)
          }}
        />

        <Progress value={(score / recipe.targetScore) * 100} className="mt-4" />
        <p className="text-xs text-center mt-1">
          {score}/{recipe.targetScore} • {moves.length}/{recipe.maxMoves} moves
        </p>

        <DialogFooter>
          {/* controls if you need them */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}