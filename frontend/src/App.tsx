import { useEffect, useState } from "react";
import type { Tile, CropType } from "@shared/types";
import GardenGrid from "@/components/GardenGrid";
import InventoryBox from "@/components/InventoryBox";
import Journal from "@/components/Journal";
import { AppShell } from "@/layout/AppShell";

type CovenState = {
  tiles: Tile[][];
  inventory: Record<CropType, number>;
};

export default function App() {
  const [state, setState] = useState<CovenState | null>(null);

  useEffect(() => {
    fetch("/api/state")
      .then(r => r.json())
      .then(setState)
      .catch(err => console.error("state fetch failed:", err));
  }, []);

  if (!state) return <div className="grid h-screen place-content-center">Loading coven state…</div>;

  return (
    <AppShell>
      <Journal />

      <main className="flex-1 overflow-y-auto p-4">
        <GardenGrid tiles={state.tiles} />
      </main>

      <aside className="w-72 shrink-0 p-4">
        <InventoryBox items={state.inventory} />
      </aside>
    </AppShell>
  );
}