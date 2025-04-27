import { cn } from '@lib/cn'
import * as TabsPrimitive from '@radix-ui/react-tabs'

export const Tabs = TabsPrimitive.Root
export const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List className={cn('inline-flex items-center gap-2', className)} {...props} />
)
export const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={cn(
      'rounded-md px-3 py-1 text-sm font-medium data-[state=active]:bg-mauve-4 data-[state=active]:text-mauve-12',
      className
    )}
    {...props}
  />
)
export const TabsContent = ({ className, ...props }: TabsPrimitive.TabsContentProps) => (
  <TabsPrimitive.Content className={cn('mt-4', className)} {...props} />
)
