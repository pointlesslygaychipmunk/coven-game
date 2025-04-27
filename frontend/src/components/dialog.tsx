import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@ui/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose   = DialogPrimitive.Close

export function DialogContent(
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
      <DialogPrimitive.Content
        {...props}
        className={cn(
          'fixed left-1/2 top-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md',
          'bg-zinc-900 p-6 shadow-xl focus:outline-none',
          props.className,
        )}
      />
    </DialogPrimitive.Portal>
  )
}

export function DialogTitle(
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
) {
  return (
    <DialogPrimitive.Title
      {...props}
      className={cn('text-lg font-semibold mb-4', props.className)}
    />
  )
}

export function DialogFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn('mt-6 flex justify-end gap-2', props.className)} />
  )
}