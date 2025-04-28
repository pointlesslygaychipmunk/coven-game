import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import type { CropType } from "@shared/types";

interface Props {
  items: Record<CropType, number>;
}

export default function InventoryBox({ items }: Props) {
  const entries = Object.entries(items).filter(([, qty]) => qty > 0);

  return (
    <Card className="bg-gradient-to-br from-stone-900 via-black to-stone-800 text-stone-200 ethereal-border fade-in-spell">
      <CardHeader>
        <CardTitle className="shimmer-text">Inventory</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2">
        {entries.length ? (
          entries.map(([crop, qty]) => (
            <span
              key={crop}
              className="rounded-full bg-stone-700/70 px-3 py-1 text-xs font-semibold tracking-wide"
            >
              {crop} × {qty}
            </span>
          ))
        ) : (
          <p className="text-xs italic text-stone-400">Empty satchel…</p>
        )}
      </CardContent>
    </Card>
  );
}
