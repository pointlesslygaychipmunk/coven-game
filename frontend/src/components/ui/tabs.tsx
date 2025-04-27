/* src/components/ui/tabs.tsx */
import * as React from "react";
import * as RDXTabs from "@radix-ui/react-tabs";
import { cn } from "@ui/utils";

export const Tabs          = RDXTabs.Root;
export const TabsList      = RDXTabs.List;
export const TabsTrigger   = RDXTabs.Trigger;
export const TabsContent   = RDXTabs.Content;

// convenience wrapper for standard look
export function DefaultTabsList(
  { className, ...props }: React.ComponentPropsWithoutRef<typeof RDXTabs.List>,
) {
  return (
    <RDXTabs.List
      className={cn(
        "inline-flex gap-2 rounded border border-layer-3 bg-layer-2 p-1",
        className,
      )}
      {...props}
    />
  );
}