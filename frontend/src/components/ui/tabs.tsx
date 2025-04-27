import { useState } from "react";
import { cn } from "@lib/utils";

export interface TabsProps {
  labels: string[];
  defaultIndex?: number;
  onChange?(idx: number): void;
  className?: string;
}

/** *very* small replacement – enough to unblock compilation */
export function Tabs({ labels, defaultIndex = 0, onChange, className }: TabsProps) {
  const [idx, setIdx] = useState(defaultIndex);
  return (
    <div className={cn("flex gap-1", className)}>
      {labels.map((l, i) => (
        <button
          key={l}
          onClick={() => {
            setIdx(i);
            onChange?.(i);
          }}
          className={cn(
            "rounded px-2 py-1 text-xs",
            i === idx ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
