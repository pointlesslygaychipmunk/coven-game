/* --------------------------------------------------------------------------
   src/components/ui/dialog.tsx
   Headless, ShadCN-compatible Dialog built on @radix-ui/react-dialog
--------------------------------------------------------------------------- */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* Root / Trigger / Close re-exports ────────────────────────────────────── */
export const Dialog            = DialogPrimitive.Root;
export const DialogTrigger     = DialogPrimitive.Trigger;
export const DialogClose       = DialogPrimitive.Close;

/* Portal – attaches to <body> so Tailwind z-index works */
export const DialogPortal = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>) => (
  <DialogPrimitive.Portal {...props} className={cn("fixed inset-0 z-50 flex items-start justify-center", className)} />
);
DialogPortal.displayName = "DialogPortal";

/* Overlay ──────────────────────────────────────────────────────────────── */
export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

/* Content ──────────────────────────────────────────────────────────────── */
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      {...props}
      className={cn(
        "relative bg-background text-foreground rounded-lg shadow-xl w-[90vw] max-w-lg p-6 animate-in zoom-in-90",
        className,
      )}
    >
      {children}
      <DialogClose className="absolute top-2 right-2 rounded-sm p-1 opacity-70 hover:opacity-100 focus:outline-none">
        <X className="h-4 w-4" />
      </DialogClose>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

/* Header / Footer helpers (optional) ------------------------------------ */
export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";