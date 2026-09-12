import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Th } from "./ui/Table.jsx";

export default function SortableTh({ label, field, sortBy, sortOrder, onSort }) {
  const active = sortBy === field;
  const Icon = !active ? ArrowUpDown : sortOrder === "asc" ? ArrowUp : ArrowDown;

  return (
    <Th>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 font-medium hover:text-primary"
      >
        {label}
        <Icon className="h-3.5 w-3.5 text-text-secondary" />
      </button>
    </Th>
  );
}
