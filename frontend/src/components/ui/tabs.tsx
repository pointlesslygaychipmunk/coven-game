/* --------------------------------------------------------------------------
   src/components/ui/tabs.tsx
   Simple Radix Tabs wrapper (API-compatible with @shadcn/ui)
--------------------------------------------------------------------------- */

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

/* <Tabs> root ──────────────────────────────────────────────────────────── */
export const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>((props, ref) => (
  <TabsPrimitive.Root ref={ref} className={cn("flex flex-col gap-2", props.className)} {...props} />
));
Tabs.displayName = "Tabs";

/* <TabsList> ───────────────────────────────────────────────────────────── */
export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>((props, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex rounded-md bg-muted p-1 text-muted-foreground",
      props.className,
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

/* <TabsTrigger> ────────────────────────────────────────────────────────── */
export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>((props, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground",
      props.className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

/* <TabsContent> ────────────────────────────────────────────────────────── */
export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>((props, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-2 focus:outline-none", props.className)}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";