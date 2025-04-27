import { useState } from 'react'
import RuneCrush from '@/components/RuneCrush'
import type { BrewMove, Player } from '@shared/types'

interface PotionPanelProps {
  player: Player                 // used for the auth header
  onBrew?: (recipeId: string) => void
}

/** eventually load from /api/recipes – for now, one hard-coded entry */
const RECIPES = [
  {
    id:          'moonwell_elixir',
    name:        'Moon-well Elixir',
    targetScore: 500,
    maxMoves:    25,
  },
]

export default function PotionPanel({ player, onBrew }: PotionPanelProps) {
  /** the panel always shows the first recipe for this prototype */
  const [recipe]       = useState(() => RECIPES[0])
  const [seed, setSeed] = useState('')
  const [open, setOpen] = useState(false)

  /** launcher ----------------------------------------------------------- */
  function startPuzzle() {
    setSeed(globalThis.crypto.randomUUID())
    setOpen(true)
  }

  /** callback from <RuneCrush> ------------------------------------------ */
  async function submit(moves: BrewMove[]) {
    await fetch('/api/brew', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-player-id':  player.id,
      },
      body: JSON.stringify({ id: recipe.id, seed, moves }),
    })

    setOpen(false)
    onBrew?.(recipe.id)
  }

  /* -------------------------------------------------------------------- */

  return (
    <section className="rounded-lg bg-stone-800/60 p-4">
      <h3 className="mb-2 text-lg font-semibold">{recipe.name}</h3>

      <button
        onClick={startPuzzle}
        className="rounded bg-emerald-500 px-3 py-1 font-medium
                   text-stone-900 transition-colors hover:bg-emerald-600"
      >
        Brew
      </button>

      {/* modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center
                        bg-black/60 backdrop-blur-sm">
          <RuneCrush
            id={recipe.id}              /* updated to match RuneCrush Props */
            seed={seed}
            targetScore={recipe.targetScore}
            maxMoves={recipe.maxMoves}
            onSubmit={submit}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </section>
  )
}