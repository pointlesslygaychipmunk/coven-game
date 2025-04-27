/** Tailwind-friendly className joiner (empties are ignored). */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/* default export so callers can `import classNames from "@ui/utils"` */
export default cn;