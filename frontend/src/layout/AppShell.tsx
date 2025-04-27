import { cn } from '@lib/cn'
import { HTMLAttributes } from 'react'

export const AppShell = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex h-screen flex-col bg-gradient-to-br from-mauve-1 to-mauve-3 text-mauve-12', className)} {...props} />
)
