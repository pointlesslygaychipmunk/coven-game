
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={`h-2 w-full overflow-hidden rounded bg-gray-800 ${className ?? ""}`}
      {...props}
    >
      <div
        style={{ width: `${value}%` }}
        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
      />
    </div>
  );
}
