import * as React from "react";
import { cn } from "@/lib/utils";

/* context ----------------------------------------------------------------- */
const TabsCtx = React.createContext<[string, React.Dispatch<React.SetStateAction<string>>] | null>(null);

/* container ---------------------------------------------------------------- */
export function Tabs ({ defaultValue, className, ...props }:
  React.ComponentPropsWithoutRef<"div"> & { defaultValue: string }) {
  const state = React.useState(defaultValue);
  return (
    <TabsCtx.Provider value={state}>
      <div className={cn("flex flex-col", className)} {...props} />
    </TabsCtx.Provider>
  );
}

/* primitive: clickable trigger ------------------------------------------- */
export function TabsTrigger (
  { value, className, ...props }:
  React.ComponentPropsWithoutRef<"button"> & { value: string }
) {
  const ctx = React.useContext(TabsCtx)!;
  const active = ctx[0] === value;
  return (
    <button
      onClick={() => ctx[1](value)}
      className={cn(
        "px-3 py-1 text-sm",
        active ? "border-b-2 border-primary" : "opacity-60",
        className
      )}
      {...props}
    />
  );
}

/* primitive: tab panel ---------------------------------------------------- */
export function TabsContent (
  { value, className, ...props }:
  React.ComponentPropsWithoutRef<"div"> & { value: string }
) {
  const [active] = React.useContext(TabsCtx)!;
  if (active !== value) return null;
  return <div className={cn("pt-4", className)} {...props} />;
}