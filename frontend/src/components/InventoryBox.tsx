import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui";

export interface InventoryItem {
  id: string;
  name: string;
}

export default function InventoryBox({ items }: { items: InventoryItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Inventory</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1">
        {items.map(it => (
          <span
            key={it.id}
            className="rounded bg-secondary px-1.5 py-0.5 text-xs leading-none"
          >
            {it.name}
          </span>
        ))}
      </CardContent>
    </Card>
  );
}