import { ChevronLeft, Users } from "lucide-react";
import { toFarsi } from "@/utils/numerals";

export interface GroupListItemProps {
  name: string;
  description?: string;
  memberCount: number;
  accent?: "violet" | "teal" | "cerise" | "sand" | "ink";
  onClick?: () => void;
}

const accentClass: Record<NonNullable<GroupListItemProps["accent"]>, string> = {
  violet: "bg-[var(--p-violet-100)] text-[var(--p-violet-700)]",
  teal:   "bg-[var(--p-teal-50)]    text-[var(--p-teal-700)]",
  cerise: "bg-[var(--p-cerise-50)]  text-[var(--p-cerise-600)]",
  sand:   "bg-[var(--p-sand-100)]   text-[var(--p-sand-700)]",
  ink:    "bg-[var(--p-ink-100)]    text-[var(--p-ink-700)]",
};

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0] ?? "")
    .join("")
    .toUpperCase();

export function GroupListItem({
  name,
  description,
  memberCount,
  accent = "violet",
  onClick,
}: GroupListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-card bg-surface p-3 text-start transition-colors hover:bg-bg cursor-pointer"
    >
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-pill text-label-md font-bold ${accentClass[accent]}`}>
        {initials(name) || <Users size={20} />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-body-md font-semibold text-text">{name}</p>
        <p className="truncate text-body-xs text-text-muted">
          {description ?? `${toFarsi(memberCount)} عضو`}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0 text-text-subtle">
        {description && (
          <span className="flex items-center gap-1 text-label-xs">
            <Users size={14} />
            {toFarsi(memberCount)}
          </span>
        )}
        <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
      </div>
    </button>
  );
}
