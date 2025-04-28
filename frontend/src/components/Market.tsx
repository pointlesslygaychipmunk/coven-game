import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function Market() {
  const rows = [
    { id: 1, item: "Mushroom", price: 5 },
    { id: 2, item: "Flower",   price: 3 },
  ];

  return (
    <div className="fade-in-spell">
      <Table className="bg-gradient-to-br from-stone-900 to-black text-stone-200 ethereal-border rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="text-stone-400">#</TableHead>
            <TableHead className="text-stone-400">Item</TableHead>
            <TableHead className="text-right text-stone-400">Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.item}</TableCell>
              <TableCell className="text-right">{r.price} ✦</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
