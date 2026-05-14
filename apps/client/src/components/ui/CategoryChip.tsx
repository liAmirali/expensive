import type { ReactNode } from "react";

export interface CategoryChipProps {
  label: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export function CategoryChip({ label, icon, selected, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-label-sm border transition-colors cursor-pointer ${
        selected
          ? "border-accent bg-accent-subtle text-accent-text"
          : "border-border bg-surface text-text-muted hover:bg-bg"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
