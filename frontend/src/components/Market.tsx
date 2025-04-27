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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map(r => (
          <TableRow key={r.id}>
            <TableCell>{r.id}</TableCell>
            <TableCell>{r.item}</TableCell>
            <TableCell className="text-right">{r.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}