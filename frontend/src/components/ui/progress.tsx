/* src/components/ui/progress.tsx */
import * as React from "react";
import { cn } from "@ui/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
}
export function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded bg-layer-3", className)}
      {...props}
    >
      <div
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        className="h-full rounded bg-accent transition-[width] duration-300"
      />
    </div>
  );
}