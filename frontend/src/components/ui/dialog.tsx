import { cn } from '@lib/cn'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

interface DialogContentProps extends DialogPrimitive.DialogContentProps {}

export const DialogContent = ({ className, ...props }: DialogContentProps) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 animate-fadeIn" />
    <DialogPrimitive.Content
      className={cn(
        'fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-mauve-2 p-6 shadow-lg focus:outline-none',
        className
      )}
      {...props}
    />
  </DialogPrimitive.Portal>
)

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn('mb-4 text-lg font-bold tracking-tight text-mauve-12', className)} {...props} />
)
