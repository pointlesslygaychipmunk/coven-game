// frontend/src/components/ui/utils/clsx.ts
/**
 * Tiny replacement for the `clsx` & `classnames` libraries.
 * Filters out falsy values and joins the rest with a single space.
 */
export default function clsx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
