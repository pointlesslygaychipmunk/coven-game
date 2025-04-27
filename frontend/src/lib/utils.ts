/** one-liner clone of shadcn’s utility until you swap to the real one */
export function cn(...classes: (string | false | undefined)[]) {
    return classes.filter(Boolean).join(" ");
  }  