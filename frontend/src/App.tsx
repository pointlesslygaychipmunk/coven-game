// src/App.tsx
import { useEffect, useState } from "react";
import { GardenGrid, InventoryBox, Journal } from "./components";

type CovenState = {
  tiles: Tile[];
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

  if (!state) return <div className="h-screen grid place-content-center">Loading coven state…</div>;

  return (
    <AppShell>
      <Journal />
      <main className="p-4 flex-1 overflow-y-auto">
        <GardenGrid tiles={state.tiles} />
      </main>
      <aside className="p-4 w-72 shrink-0 space-y-4">
        <InventoryBox items={state.inventory} />
      </aside>
    </AppShell>
  );
}