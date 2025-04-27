import { cn } from "@lib/utils";

export function Dialog(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "fixed inset-0 z-40 grid place-items-center bg-black/40 backdrop-blur-sm",
        props.className
      )}
    />
  );
}

export const DialogContent = (p: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...p}
    className={cn(
      "rounded-md bg-background p-6 shadow-lg outline-none",
      p.className
    )}
  />
);

export const DialogHeader = (p: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 {...p} className={cn("mb-4 text-lg font-semibold", p.className)} />
);