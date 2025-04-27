import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@ui/utils'

export const Tabs          = TabsPrimitive.Root
export const TabsList      = TabsPrimitive.List
export const TabsTrigger   = TabsPrimitive.Trigger
export const TabsContent   = TabsPrimitive.Content
export const DefaultTabsList = (p: React.ComponentPropsWithoutRef<'div'>) => (
  <TabsList
    {...p}
    className={cn('inline-flex rounded bg-zinc-800 p-1', p.className)}
  />
)