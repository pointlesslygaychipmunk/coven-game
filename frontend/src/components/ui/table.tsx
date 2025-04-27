export const Table = (p: React.HTMLAttributes<HTMLTableElement>) => (
    <table {...p} className={`w-full text-sm ${p.className ?? ""}`} />
  );  