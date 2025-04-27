// src/components/ui/utils.ts
export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/* 👇 <-- add this line */
export default cn;          // so `import classNames from '@ui/utils'` works
