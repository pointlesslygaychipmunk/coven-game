import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@lib/utils";
import { ReactNode } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

// --- Overlay -------------------------------------------------------------
function Overlay() {
  return (
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
  );
}

// --- Content -------------------------------------------------------------
export interface DialogContentProps extends DialogPrimitive.DialogContentProps {
  className?: string;
  children: ReactNode;
}

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <Overlay />
      <DialogPrimitive.Content
        {...props}
        className={cn(
          "fixed left-1/2 top-1/2 w-[90vw] max-h-[90vh] -translate-x-1/2 -translate-y-1/2", 
          "rounded-lg border border-stone-700 bg-stone-800 p-6 shadow-xl outline-none",
          className
        )}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

// --- Header / Title / Footer --------------------------------------------
export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4 space-y-1 text-center">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <DialogPrimitive.Title className="text-xl font-semibold">{children}</DialogPrimitive.Title>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{children}</div>;
}