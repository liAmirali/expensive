import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { MemberChip } from "@/components/ui/MemberChip";
import { UserSearchResultItem } from "@/components/ui/UserSearchResultItem";
import { GlassCard } from "@/components/ui/GlassCard";
import type { UserPublicDTO } from "@/api/generated/schemas";

export interface MemberPickerProps {
  query: string;
  onQueryChange: (q: string) => void;
  results: UserPublicDTO[];
  isSearching?: boolean;
  selected: UserPublicDTO[];
  onAdd: (user: UserPublicDTO) => void;
  onRemove: (userId: string) => void;
  minQueryLength?: number;
}

export function MemberPicker({
  query,
  onQueryChange,
  results,
  isSearching = false,
  selected,
  onAdd,
  onRemove,
  minQueryLength = 2,
}: MemberPickerProps) {
  const selectedIds = new Set(selected.map((u) => u.id));
  const visibleResults = results.filter((u) => !selectedIds.has(u.id));
  const queryTooShort = query.trim().length < minQueryLength;

  return (
    <div className="flex flex-col gap-3">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((u) => (
            <MemberChip key={u.id} name={u.fullName} onRemove={() => onRemove(u.id)} />
          ))}
        </div>
      )}

      <Input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="جستجوی کاربر با نام یا ایمیل…"
        startIcon={<Search size={18} />}
        aria-label="جستجوی کاربر"
      />

      {!queryTooShort && (
        <GlassCard padding="none" radius="xl">
          {isSearching ? (
            <p className="p-4 text-center text-body-sm text-text-muted">در حال جستجو…</p>
          ) : visibleResults.length === 0 ? (
            <p className="p-4 text-center text-body-sm text-text-muted">کاربری یافت نشد.</p>
          ) : (
            <ul className="p-2">
              {visibleResults.map((u) => (
                <li key={u.id}>
                  <UserSearchResultItem
                    fullName={u.fullName}
                    email={u.email}
                    onAdd={() => onAdd(u)}
                  />
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      )}
    </div>
  );
}
