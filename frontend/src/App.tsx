import { useEffect, useState, useMemo } from "react";

import { GardenGrid, InventoryBox, Journal } from "@/components";
import { AppShell } from "@/layout/AppShell";
import type { Tile, CropType } from "@shared/types";

type CovenState = {
  tiles: Tile[][];
  inventory: Record<CropType, number>;
};

export default function App() {
  const [state, setState] = useState<CovenState | null>(null);

  useEffect(() => {
    fetch("/api/state")
      .then(r => r.json() as Promise<CovenState>)
      .then(setState)
      .catch(err => console.error("state fetch failed:", err));
  }, []);

  const inventoryItems = useMemo(
    () =>
      Object.entries(state?.inventory ?? {}).map(([k, v]) => ({
        id: k,
        name: `${k} ×${v}`
      })),
    [state?.inventory]
  );

  if (!state)
    return (
      <div className="grid h-screen place-content-center text-sm text-muted-foreground">
        Loading coven state…
      </div>
    );

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