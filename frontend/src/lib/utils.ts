// central place for small helpers ────────────────────────────────────────────
import { clsx, type ClassValue }      from "clsx";
import { twMerge }                    from "tailwind-merge";

/** tailwind-aware className concatenation */
export function cn ( ...inputs: ClassValue[] ): string {
  return twMerge( clsx(...inputs) );
}