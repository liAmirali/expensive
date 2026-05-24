import { X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { toFarsi } from "@/utils/numerals";
import type { GroupRole, GroupMembershipStatus } from "@/api/generated/schemas";

export interface MembersListItem {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role?: GroupRole;
  status?: GroupMembershipStatus;
  isYou?: boolean;
  canRemove?: boolean;
}

export interface MembersListProps {
  items: MembersListItem[];
  emptyText?: string;
  countLabel?: (n: number) => string;
  onMemberClick?: (id: string) => void;
  onRemoveClick?: (id: string) => void;
  removingId?: string | null;
}

const roleLabel: Record<GroupRole, string> = {
  OWNER: "مالک",
  ADMIN: "مدیر",
  MEMBER: "عضو",
};

const statusLabel: Record<GroupMembershipStatus, string> = {
  ACTIVE: "فعال",
  PENDING: "در انتظار",
  REMOVED: "حذف‌شده",
};

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0] ?? "")
    .join("")
    .toUpperCase();

export function MembersList({
  items,
  emptyText = "عضوی نیست.",
  countLabel = (n) => `${toFarsi(n)} نفر`,
  onMemberClick,
  onRemoveClick,
  removingId,
}: MembersListProps) {
  return (
    <GlassCard padding="none" radius="xl">
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <p className="text-body-xs text-text-muted">{countLabel(items.length)}</p>
      </header>
      {items.length === 0 ? (
        <p className="p-4 text-center text-body-sm text-text-muted">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {items.map((m) => {
            const clickable = !!onMemberClick;
            return (
              <li key={m.id} className="flex items-center gap-3 p-3">
                <button
                  type="button"
                  onClick={clickable ? () => onMemberClick?.(m.id) : undefined}
                  disabled={!clickable}
                  className={`flex flex-1 items-center gap-3 min-w-0 text-start ${
                    clickable ? "cursor-pointer hover:opacity-80" : ""
                  }`}
                >
                  <span className="flex size-10 items-center justify-center overflow-hidden rounded-pill bg-[var(--p-violet-100)] text-[var(--p-violet-700)] text-label-sm font-bold">
                    {m.avatarUrl ? (
                      <img
                        src={m.avatarUrl}
                        alt={m.fullName}
                        className="size-full object-cover"
                      />
                    ) : (
                      initials(m.fullName) || "?"
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm font-semibold text-text">
                      {m.fullName}
                      {m.isYou && (
                        <span className="ms-2 text-body-xs text-text-muted">(شما)</span>
                      )}
                    </p>
                    <p className="truncate text-body-xs text-text-muted">{m.email}</p>
                  </div>
                </button>
                <div className="flex flex-col items-end gap-1">
                  {m.role && (
                    <span className="rounded-pill bg-surface-2 px-2 py-0.5 text-label-xs text-text-muted">
                      {roleLabel[m.role]}
                    </span>
                  )}
                  {m.status && m.status !== "ACTIVE" && (
                    <span className="rounded-pill bg-[var(--p-sand-100)] px-2 py-0.5 text-label-xs text-[var(--p-sand-700)]">
                      {statusLabel[m.status]}
                    </span>
                  )}
                </div>
                {m.canRemove && onRemoveClick && (
                  <button
                    type="button"
                    onClick={() => onRemoveClick(m.id)}
                    disabled={removingId === m.id}
                    aria-label={`حذف ${m.fullName}`}
                    className="flex size-8 items-center justify-center rounded-pill text-text-muted hover:bg-negative-subtle hover:text-negative-text disabled:opacity-40 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}