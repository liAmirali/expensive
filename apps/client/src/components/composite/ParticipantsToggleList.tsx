import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export interface ParticipantsToggleOption {
  id: string;
  fullName: string;
  email: string;
  locked?: boolean;
}

export interface ParticipantsToggleListProps {
  options: ParticipantsToggleOption[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  getRowTrailing?: (id: string, selected: boolean) => ReactNode;
}

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((s) => s[0] ?? "").join("").toUpperCase();

export function ParticipantsToggleList({
  options,
  selectedIds,
  onToggle,
  getRowTrailing,
}: ParticipantsToggleListProps) {
  if (options.length === 0) {
    return (
      <GlassCard padding="lg" radius="xl">
        <p className="text-center text-body-sm text-text-muted">
          عضوی برای انتخاب وجود ندارد.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="none" radius="xl">
      <ul className="p-2">
        {options.map((u) => {
          const selected = selectedIds.has(u.id);
          return (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => !u.locked && onToggle(u.id)}
                disabled={u.locked}
                aria-pressed={selected}
                className={`flex w-full items-center gap-3 rounded-card p-2.5 text-start transition-colors ${
                  u.locked ? "cursor-not-allowed opacity-70" : "hover:bg-bg cursor-pointer"
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-[var(--p-violet-100)] text-[var(--p-violet-700)] text-label-sm font-bold">
                  {initials(u.fullName) || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-md font-medium text-text">
                    {u.fullName}
                    {u.locked && (
                      <span className="ms-2 text-overline text-text-muted">(شما)</span>
                    )}
                  </p>
                  <p className="truncate text-body-xs text-text-muted" dir="ltr">{u.email}</p>
                </div>
                {getRowTrailing && (
                  <span className="shrink-0 text-label-sm text-text-muted tabular-nums">
                    {getRowTrailing(u.id, selected)}
                  </span>
                )}
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-pill border transition-colors ${
                    selected
                      ? "bg-accent border-accent text-text-on-accent"
                      : "bg-surface border-border-strong text-transparent"
                  }`}
                >
                  <Check size={14} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
