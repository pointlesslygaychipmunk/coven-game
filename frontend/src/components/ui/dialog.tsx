import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog       = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = ({ className, ...props }:
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
    <DialogPrimitive.Content
      className={cn("fixed left-[50%] top-[50%] w-[90vw] max-w-md "
                  + "translate-x-[-50%] translate-y-[-50%] rounded-md "
                  + "bg-popover p-6 shadow-lg", className)}
      {...props}
    />
  </DialogPrimitive.Portal>
);
DialogContent.displayName = "DialogContent";