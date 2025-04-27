import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow",
                               className)}
       {...props}/>
));
Card.displayName = "Card";

export const CardHeader   = ({ className, ...p }:
  React.HTMLAttributes<HTMLDivElement>) =>
  <div className={cn("p-4 border-b", className)} {...p} />;
export const CardContent  = ({ className, ...p }:
  React.HTMLAttributes<HTMLDivElement>) =>
  <div className={cn("p-4", className)} {...p} />;
export const CardFooter   = ({ className, ...p }:
  React.HTMLAttributes<HTMLDivElement>) =>
  <div className={cn("p-4 border-t", className)} {...p} />;

/* re-export as namespace, like shadcn does */
export default Object.assign(Card, { Header:CardHeader, Content:CardContent, Footer:CardFooter });