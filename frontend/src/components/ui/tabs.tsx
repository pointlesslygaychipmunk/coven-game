import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({ className, ...props }:
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    className={cn("inline-flex h-10 items-center justify-center rounded-lg "
                + "bg-muted p-1 text-muted-foreground", className)}
    {...props}
  />
);

export const TabsTrigger = ({ className, ...props }:
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md "
      + "px-3 py-1.5 text-sm font-medium ring-offset-background "
      + "transition-colors focus-visible:outline-none focus-visible:ring-2 "
      + "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none "
      + "disabled:opacity-50 data-[state=active]:bg-background "
      + "data-[state=active]:text-foreground", className)}
    {...props}
  />
);