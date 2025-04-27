/* very-light Radix-flavoured table primitives ─────────────────────────────── */
import * as React from "react";
import { cn }      from "@/lib/utils";

// container ──────────────────────────────────────────────────────────────────
export const Table     = React.forwardRef<
  HTMLTableElement, React.ComponentPropsWithoutRef<"table">
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

export const TableHeader = (props: React.ComponentPropsWithoutRef<"thead">) => (
  <thead className="bg-muted/40">{props.children}</thead>
);

export const TableBody = (props: React.ComponentPropsWithoutRef<"tbody">) => (
  <tbody className="[&_tr:last-child]:border-0">{props.children}</tbody>
);

export const TableRow = (props: React.ComponentPropsWithoutRef<"tr">) => (
  <tr className="border-b transition-colors hover:bg-muted/50">{props.children}</tr>
);

export const TableHead = (props: React.ComponentPropsWithoutRef<"th">) => (
  <th className="h-9 px-4 text-left font-medium">{props.children}</th>
);

export const TableCell = (props: React.ComponentPropsWithoutRef<"td">) => (
  <td className="p-4 align-middle">{props.children}</td>
);