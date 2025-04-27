/* src/components/InventoryBox.tsx */
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import type { CropType } from "@shared/types";

interface Props {
  items: Record<CropType, number>;
}

export default function InventoryBox({ items }: Props) {
  const entries = Object.entries(items).filter(([, qty]) => qty > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-1">
        {entries.length ? (
          entries.map(([crop, qty]) => (
            <span
              key={crop}
              className="rounded bg-layer-2/70 px-2 py-0.5 text-xs font-medium"
            >
              {crop} × {qty}
            </span>
          ))
        ) : (
          <p className="text-xs italic text-layer-11">Empty.</p>
        )}
      </CardContent>
    </Card>
  );
}