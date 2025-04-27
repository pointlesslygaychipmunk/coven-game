import {
   Card,
   CardHeader,
   CardTitle,
   CardContent,
  } from "@/components/ui/card";

export default function InventoryBox({ items }: { items: { id: string; name: string }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Inventory</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1">
        {items.map(it => (
          <span
            key={it.id}
            className="px-1.5 py-0.5 rounded bg-mauve-300/50 text-xs"
          >
            {it.name}
          </span>
        ))}
      </CardContent>
    </Card>
  );
}