/* src/components/ui/dialog.tsx */
import * as React from "react";
import * as RDXDialog from "@radix-ui/react-dialog";
import { cn } from "@ui/utils";

export const Dialog      = RDXDialog.Root;
export const DialogTrigger = RDXDialog.Trigger;

export function DialogContent(
  { className, ...props }: React.ComponentPropsWithoutRef<typeof RDXDialog.Content>,
) {
  return (
    <RDXDialog.Portal>
      <RDXDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <RDXDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-layer-1 p-6 shadow-lg",
          className,
        )}
        {...props}
      />
    </RDXDialog.Portal>
  );
}

export function DialogHeader(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return <header className="mb-4 text-lg font-medium" {...props} />;
}

export function DialogFooter(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return <footer className="mt-4 flex justify-end gap-2" {...props} />;
}