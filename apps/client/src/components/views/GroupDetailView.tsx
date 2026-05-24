import { ArrowDownLeft, ArrowUpRight, ChevronRight, Plus, UserPlus } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { LedgersList, type LedgersListItem } from "@/components/composite/LedgersList";
import { MembersList, type MembersListItem } from "@/components/composite/MembersList";
import { MemberPicker } from "@/components/composite/MemberPicker";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { toFarsi } from "@/utils/numerals";
import type { UserPublicDTO } from "@/api/generated/schemas";
import { useState } from "react";

export interface GroupDetailViewProps {
  name: string;
  memberCount: number;
  archived?: boolean;
  owedToYou: number;
  youOwe: number;
  ledgers: LedgersListItem[];
  members: MembersListItem[];
  onMemberClick?: (id: string) => void;
  canManageMembers?: boolean;
  inviteQuery: string;
  onInviteQueryChange: (q: string) => void;
  inviteResults: UserPublicDTO[];
  isSearchingInvite?: boolean;
  onInviteUser: (u: UserPublicDTO) => void;
  isInviting?: boolean;
  inviteError?: string;
  onRemoveMember: (userId: string) => void;
  removingMemberId?: string | null;
  removeError?: string;
  isLoading?: boolean;
  errorMessage?: string;
  onBack?: () => void;
  onCreateLedgerClick?: () => void;
}

export function GroupDetailView({
  name,
  memberCount,
  archived = false,
  owedToYou,
  youOwe,
  ledgers,
  members,
  onMemberClick,
  canManageMembers = false,
  inviteQuery,
  onInviteQueryChange,
  inviteResults,
  isSearchingInvite,
  onInviteUser,
  isInviting,
  inviteError,
  onRemoveMember,
  removingMemberId,
  removeError,
  isLoading = false,
  errorMessage,
  onBack,
  onCreateLedgerClick,
}: GroupDetailViewProps) {
  const [showInvite, setShowInvite] = useState(false);
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="بازگشت"
          className="flex size-10 shrink-0 items-center justify-center rounded-pill text-text-muted hover:bg-surface hover:text-text transition-colors cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate text-h3 font-bold text-text">{name}</h1>
          <p className="text-body-xs text-text-muted">
            {toFarsi(memberCount)} عضو{archived && " · بایگانی شده"}
          </p>
        </div>
        <div className="size-10 shrink-0" />
      </header>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="طلب شما"
          amount={owedToYou}
          tone="positive"
          icon={<ArrowDownLeft size={16} />}
        />
        <StatCard
          label="بدهی شما"
          amount={youOwe}
          tone="negative"
          icon={<ArrowUpRight size={16} />}
        />
      </div>

      <section className="flex flex-col gap-3">
        <header className="flex items-center justify-between px-1">
          <h2 className="text-h4 font-semibold text-text">دفترها</h2>
          {onCreateLedgerClick && (
            <button
              type="button"
              onClick={onCreateLedgerClick}
              aria-label="ساخت دفتر جدید"
              className="flex size-9 items-center justify-center rounded-pill bg-accent text-text-on-accent hover:bg-accent-hover transition-colors cursor-pointer"
            >
              <Plus size={18} />
            </button>
          )}
        </header>

        {errorMessage ? (
          <GlassCard padding="lg" radius="xl">
            <p role="alert" className="text-center text-body-sm text-negative-text">
              {errorMessage}
            </p>
          </GlassCard>
        ) : isLoading ? (
          <LedgersListSkeleton />
        ) : (
          <LedgersList items={ledgers} />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <header className="flex items-center justify-between px-1">
          <h2 className="text-h4 font-semibold text-text">اعضا</h2>
          {canManageMembers && (
            <Button
              type="button"
              variant="soft"
              size="sm"
              startIcon={<UserPlus size={16} />}
              onClick={() => setShowInvite((v) => !v)}
            >
              {showInvite ? "بستن" : "افزودن"}
            </Button>
          )}
        </header>

        {canManageMembers && showInvite && (
          <div className="flex flex-col gap-2">
            <MemberPicker
              query={inviteQuery}
              onQueryChange={onInviteQueryChange}
              results={inviteResults}
              isSearching={isSearchingInvite || isInviting}
              selected={[]}
              onAdd={(u) => onInviteUser(u)}
              onRemove={() => {}}
            />
            {inviteError && (
              <p role="alert" className="text-body-sm text-negative-text">
                {inviteError}
              </p>
            )}
          </div>
        )}

        {removeError && (
          <p role="alert" className="text-body-sm text-negative-text">
            {removeError}
          </p>
        )}

        {isLoading ? (
          <MembersListSkeleton />
        ) : (
          <MembersList
            items={members}
            onMemberClick={onMemberClick}
            onRemoveClick={onRemoveMember}
            removingId={removingMemberId}
          />
        )}
      </section>
    </div>
  );
}

function MembersListSkeleton() {
  return (
    <GlassCard padding="none" radius="xl">
      <ul className="divide-y divide-border/60 p-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 p-3">
            <div className="size-10 rounded-pill bg-border/60 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-28 rounded-sm bg-border/60 animate-pulse" />
              <div className="h-3 w-40 rounded-sm bg-border/40 animate-pulse" />
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

function LedgersListSkeleton() {
  return (
    <GlassCard padding="none" radius="xl">
      <ul className="divide-y divide-border/60 p-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 p-3">
            <div className="size-11 rounded-card bg-border/60 animate-pulse" />
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
