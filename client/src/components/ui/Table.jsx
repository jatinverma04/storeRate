export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }) {
  return (
    <thead className="border-b border-border bg-background text-text-primary">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return <tbody className="text-text-primary">{children}</tbody>;
}

export function TableRow({ children, className = "" }) {
  return (
    <tr className={`border-b border-border last:border-0 hover:bg-background/80 ${className}`}>
      {children}
    </tr>
  );
}

export function Th({ children, className = "" }) {
  return (
    <th className={`px-4 py-3 font-medium ${className}`}>{children}</th>
  );
}

export function Td({ children, className = "", ...props }) {
  return (
    <td className={`px-4 py-3 ${className}`} {...props}>
      {children}
    </td>
  );
}
