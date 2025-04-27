
import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;

export const DialogContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <RadixDialog.Content
        ref={ref}
        className={cn("fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-popover p-6 shadow-lg", className)}
        {...props}
      />
    </RadixDialog.Portal>
  )
);

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-lg font-medium mb-4", className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-4 flex justify-end gap-2", className)} {...props} />
);
