import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@ui/utils'

/** Title text inside a dialog */
export const DialogTitle = DialogPrimitive.Title

/** Right-aligned action row at the bottom of a dialog */
export function DialogFooter(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  const { className, ...rest } = props
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