import { useEffect, useState } from "react";

import { GardenGrid, InventoryBox, Journal } from "@/components";
import { AppShell } from "@/layout/AppShell";

import type { Tile, CropType } from "@shared/types";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type CovenState = {
  /** 10 × 10 board coming from the backend                                         */
  tiles: Tile[][];
  /** keyed by crop name (​"mushroom" | "flower" | "herb" | "fruit") -> quantity   */
  inventory: Record<CropType, number>;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [state, setState] = useState<CovenState | null>(null);

  /* one-shot load of the player-specific session state ---------------------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetch("/api/state").then((r) => r.json());
        setState(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("state fetch failed:", err);
      }
    })();
  }, []);

  if (!state) {
    return (
      <div className="grid h-screen place-content-center text-sm text-muted-foreground">
        Loading coven state…
      </div>
    );
  }

  /* transform the `{ mushroom: 4, … }` record into nice pill labels --------- */
  const inventoryItems = Object.entries(state.inventory).map(([id, qty]) => ({
    id,
    name: `${id} × ${qty}`,
  }));

  return (
    <AppShell>
      <Journal />

      <main className="flex-1 overflow-y-auto p-4">
        <GardenGrid tiles={state.tiles} />
      </main>

      <aside className="w-72 shrink-0 space-y-4 p-4">
        <InventoryBox items={inventoryItems} />
      </aside>
    </AppShell>
  );
}