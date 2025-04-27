import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@ui/utils'

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** 0 – 100 */
  value: number
}

export const Progress = ({ value, className, ...props }: ProgressProps) => (
  <ProgressPrimitive.Root
    value={value}
    className={cn('relative h-2 w-full rounded bg-zinc-800', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      style={{ width: `${value}%` }}
      className="block h-full rounded bg-emerald-500 transition-[width]"
    />
  </ProgressPrimitive.Root>
)
Progress.displayName = 'Progress'