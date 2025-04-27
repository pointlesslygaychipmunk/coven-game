import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@lib/cn";
import { ReactNode } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;

export function DialogContent({ children, className, ...props }: { children: ReactNode; className?: string } & DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Content
      {...props}
      className={cn("fixed inset-0 m-auto max-h-[90vh] w-[90vw] max-w-lg rounded bg-popover p-6 shadow", className)}
    >
      {children}
    </DialogPrimitive.Content>
  );
}

export function DialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("mb-4 text-lg font-semibold", className)}>{children}</h2>;
}

export { DialogTitle }
export { DialogFooter } 