
import * as React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = RadixTabs.Root;
export const TabsList = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixTabs.List>) => (
  <RadixTabs.List className={cn("inline-flex space-x-1 rounded bg-muted p-1", className)} {...props} />
);

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Trigger
      ref={ref}
      className={cn(
        "px-3 py-1.5 rounded text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
);

export const TabsContent = RadixTabs.Content;
