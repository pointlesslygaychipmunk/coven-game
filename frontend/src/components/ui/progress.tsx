import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<"div"> {
  /** 0-100 */
  value?: number;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, className, ...props }, ref) => (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 w-full rounded bg-muted/40 overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        style={{ width: `${value}%` }}
        className="h-full bg-primary transition-[width]"
      />
    </div>
  )
);
Progress.displayName = "Progress";