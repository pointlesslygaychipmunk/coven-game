
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function InventoryBox({ items }: { items: Record<string, number>; }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm tracking-wide uppercase">Inventory</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1">
        {Object.entries(items).map(([id, qty]) => (
          <span
            key={id}
            className="px-1.5 py-0.5 rounded bg-mauve-300/50 text-xs flex items-center gap-1"
          >
            {id} <strong>{qty}</strong>
          </span>
        ))}
      </CardContent>
    </Card>
  );
}
