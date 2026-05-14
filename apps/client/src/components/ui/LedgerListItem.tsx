import { ChevronLeft, Lock, Users } from "lucide-react";

export type LedgerVisibility = "PRIVATE_TO_PARTICIPANTS" | "VISIBLE_TO_GROUP";

export interface LedgerListItemProps {
  name: string;
  description?: string;
  visibility: LedgerVisibility;
  closed?: boolean;
  onClick?: () => void;
}

const visibilityLabel: Record<LedgerVisibility, string> = {
  PRIVATE_TO_PARTICIPANTS: "خصوصی",
  VISIBLE_TO_GROUP:        "گروهی",
};

export function LedgerListItem({
  name,
  description,
  visibility,
  closed = false,
  onClick,
}: LedgerListItemProps) {
  const VisIcon = visibility === "PRIVATE_TO_PARTICIPANTS" ? Lock : Users;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-card bg-surface p-3 text-start transition-colors hover:bg-bg cursor-pointer"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-card bg-[var(--p-violet-100)] text-[var(--p-violet-700)]">
        <VisIcon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-body-md font-semibold text-text">{name}</p>
          {closed && (
            <span className="shrink-0 rounded-pill bg-[var(--p-sand-100)] px-2 py-0.5 text-overline text-[var(--p-sand-700)]">
              بسته
            </span>
          )}
        </div>
        <p className="truncate text-body-xs text-text-muted">
          {description ?? visibilityLabel[visibility]}
        </p>
      </div>

      <ChevronLeft size={18} className="shrink-0 text-text-subtle transition-transform group-hover:-translate-x-0.5" />
    </button>
  );
}
