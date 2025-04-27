/* Tailwind-friendly utility the whole design system hangs on. */
export function cn(...cls: Array<string | false | null | undefined>): string {
  return cls.filter(Boolean).join(" ");
}

/* Provide a default so older imports `import classNames from "@ui/utils"` work */
export default cn;