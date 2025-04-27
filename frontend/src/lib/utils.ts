/**
 * utils.ts
 * ----------
 * Handy helpers shared across the frontend.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind-aware class-name combiner.
 *
 * ```ts
 * <button className={cn("btn", isActive && "btn-primary")} />
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}