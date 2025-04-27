/*  src/components/ui/utils.ts
    utility helpers for UI components
------------------------------------------------------------------ */

/** Join class names (ignores falsy).  */
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

/* 👇 <-- add this line */
export default cn;          // so `import classNames from '@ui/utils'` works
