import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
  } from '@/components/ui/table';
import { useEffect, useState } from 'react';

interface Price { id: string; item: string; value: number; delta: number }

export default function Market() {
  const [rows, setRows] = useState<Price[]>([]);

  useEffect(() => {
    // socket-io listener
    window.socket.on('price', (p: Price) =>
      setRows(r => {
        const next = r.filter(x => x.id !== p.id);
        return [...next, p].sort((a, b) => a.item.localeCompare(b.item));
      }));
  }, []);

  return (
    <Table className="w-full text-xs">
      <TableHeader>
        <TableRow>
          <TableCell>Item</TableCell>
          <TableCell align="right">Price</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(r => (
          <TableRow key={r.id}>
            <TableCell>{r.item}</TableCell>
            <TableCell align="right">
              <span
                className={
                  r.delta === 0
                    ? ''
                    : r.delta > 0
                    ? 'text-green-500 animate-pulse'
                    : 'text-red-500 animate-pulse'
                }
              >
                {r.value.toFixed(2)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}