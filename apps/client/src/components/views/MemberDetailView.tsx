import { ChevronRight, Mail, User as UserIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export interface MemberDetailViewProps {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  isLoading?: boolean;
  errorMessage?: string;
  onBack: () => void;
}

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0] ?? "")
    .join("")
    .toUpperCase();

export function MemberDetailView({
  fullName,
  email,
  avatarUrl,
  isLoading = false,
  errorMessage,
  onBack,
}: MemberDetailViewProps) {
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
        <h1 className="min-w-0 flex-1 truncate text-center text-h3 font-bold text-text">
          پروفایل عضو
        </h1>
        <div className="size-10 shrink-0" />
      </header>

      {errorMessage ? (
        <GlassCard padding="lg" radius="xl">
          <p role="alert" className="text-center text-body-sm text-negative-text">
            {errorMessage}
          </p>
        </GlassCard>
      ) : isLoading ? (
        <GlassCard padding="lg" radius="xl">
          <div className="flex flex-col items-center gap-3">
            <div className="size-24 rounded-pill bg-border/60 animate-pulse" />
            <div className="h-4 w-32 rounded-sm bg-border/60 animate-pulse" />
            <div className="h-3 w-40 rounded-sm bg-border/40 animate-pulse" />
          </div>
        </GlassCard>
      ) : (
        <>
          <GlassCard padding="lg" radius="xl">
            <div className="flex flex-col items-center gap-3">
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-pill bg-[var(--p-violet-100)] text-[var(--p-violet-700)]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="size-full object-cover" />
                ) : (
                  <span className="text-h2 font-bold">
                    {initialsOf(fullName) || <UserIcon size={32} />}
                  </span>
                )}
              </div>
              <p className="text-h4 font-semibold text-text">{fullName}</p>
            </div>
          </GlassCard>

          <GlassCard padding="none" radius="xl">
            <ul className="divide-y divide-border/60">
              <li className="flex items-center gap-3 p-4">
                <Mail size={18} className="text-text-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-body-xs text-text-muted">ایمیل</p>
                  <p dir="ltr" className="truncate text-body-sm text-text">
                    {email}
                  </p>
                </div>
              </li>
            </ul>
          </GlassCard>
        </>
      )}
    </div>
  );
}
