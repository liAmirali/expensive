import { Plus } from "lucide-react";
import { GroupsList, type GroupsListItem } from "@/components/composite/GroupsList";
import { GlassCard } from "@/components/ui/GlassCard";
import { toFarsi } from "@/utils/numerals";

export interface GroupsViewProps {
  groups: GroupsListItem[];
  isLoading?: boolean;
  errorMessage?: string;
  onCreateGroupClick?: () => void;
}

export function GroupsView({
  groups,
  isLoading = false,
  errorMessage,
  onCreateGroupClick,
}: GroupsViewProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text">گروه‌ها</h1>
          {!isLoading && !errorMessage && (
            <p className="text-body-sm text-text-muted">
              {toFarsi(groups.length)} گروه فعال
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onCreateGroupClick}
          aria-label="ساخت گروه جدید"
          className="flex size-11 items-center justify-center rounded-pill bg-accent text-text-on-accent shadow-[0_10px_30px_-12px_rgba(67,87,173,0.6)] hover:bg-accent-hover transition-colors cursor-pointer"
        >
          <Plus size={20} />
        </button>
      </header>

      {errorMessage ? (
        <GlassCard padding="lg" radius="xl">
          <p role="alert" className="text-center text-body-sm text-negative-text">
            {errorMessage}
          </p>
        </GlassCard>
      ) : isLoading ? (
        <GroupsListSkeleton />
      ) : (
        <GroupsList items={groups} />
      )}
    </div>
  );
}

function GroupsListSkeleton() {
  return (
    <GlassCard padding="none" radius="xl">
      <ul className="divide-y divide-border/60 p-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 p-3">
            <div className="size-12 rounded-pill bg-border/60 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-32 rounded-sm bg-border/60 animate-pulse" />
              <div className="h-3 w-20 rounded-sm bg-border/40 animate-pulse" />
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
