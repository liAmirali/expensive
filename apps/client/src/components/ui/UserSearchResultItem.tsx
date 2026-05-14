import { Plus } from "lucide-react";

export interface UserSearchResultItemProps {
  fullName: string;
  email: string;
  onAdd?: () => void;
  disabled?: boolean;
}

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((s) => s[0] ?? "").join("").toUpperCase();

export function UserSearchResultItem({
  fullName,
  email,
  onAdd,
  disabled = false,
}: UserSearchResultItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-card p-2.5 transition-colors hover:bg-bg">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-[var(--p-violet-100)] text-[var(--p-violet-700)] text-label-sm font-bold">
        {initials(fullName) || "?"}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-body-md font-medium text-text">{fullName}</p>
        <p className="truncate text-body-xs text-text-muted" dir="ltr">{email}</p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        aria-label={`افزودن ${fullName}`}
        className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-accent text-text-on-accent hover:bg-accent-hover disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
