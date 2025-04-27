import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@lib/cn";
import { ComponentProps } from "react";

export interface ProgressProps extends ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
  max?: number;
}

export const Progress = ({ className, value = 0, max = 100, ...props }: ProgressProps) => (
  <ProgressPrimitive.Root value={value} max={max} className={cn("relative h-2 w-full overflow-hidden rounded bg-muted", className)} {...props}>
    <ProgressPrimitive.Indicator
      className="absolute h-full bg-primary transition-[width]"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </ProgressPrimitive.Root>
);
