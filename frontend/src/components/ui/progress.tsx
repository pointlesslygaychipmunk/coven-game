import { cn } from '@lib/cn'
import * as ProgressPrimitive from '@radix-ui/react-progress'

export interface ProgressProps extends ProgressPrimitive.ProgressProps {}

export const Progress = ({ className, value, max = 100, ...props }: ProgressProps) => (
  <ProgressPrimitive.Root
    max={max}
    value={value}
    className={cn('relative h-2 w-full overflow-hidden rounded-full bg-mauve-5', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-green-9 transition-all"
      style={{ transform: `translateX(${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
)
