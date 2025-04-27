import { cn } from "@lib/utils";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("rounded-md border bg-card p-4", props.className)} />;
}
export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("mb-2 flex items-center justify-between", props.className)} />;
}
export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("space-y-2", props.className)} />;
}
export const CardTitle = (p: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 {...p} className={cn("font-medium", p.className)} />
);