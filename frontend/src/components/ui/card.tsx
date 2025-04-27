import { cn } from '@lib/cn'
import { forwardRef, HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-lg border bg-mauve-100/5 p-4 shadow', className)} {...props} />
))
Card.displayName = 'Card'

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-2 flex items-center justify-between', className)} {...props} />
)

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-sm font-semibold tracking-wide uppercase text-mauve-12', className)} {...props} />
)

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-2', className)} {...props} />
)
