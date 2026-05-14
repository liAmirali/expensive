import { ArrowDownLeft, ArrowUpRight, ChevronRight, Lock, Plus, Users } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExpensesList, type ExpensesListItem } from "@/components/composite/ExpensesList";
import { toFarsi } from "@/utils/numerals";
import type { LedgerVisibility as LedgerVisibilityT } from "@/api/generated/schemas";

export interface LedgerDetailViewProps {
  ledgerName: string;
  groupName: string;
  visibility: LedgerVisibilityT;
  closed?: boolean;
  totalSpent: number;
  myShare: number;
  netBalance: number;
  expenseCount: number;
  expenses: ExpensesListItem[];
  isLoading?: boolean;
  errorMessage?: string;
  onBack: () => void;
  onAddExpense: () => void;
}

export function LedgerDetailView({
  ledgerName,
  groupName,
  visibility,
  closed,
  totalSpent,
  myShare,
  netBalance,
  expenseCount,
  expenses,
  isLoading,
  errorMessage,
  onBack,
  onAddExpense,
}: LedgerDetailViewProps) {
  const isPrivate = visibility === "PRIVATE_TO_PARTICIPANTS";

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-20">
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
          <h1 className="truncate text-h3 font-bold text-text">{ledgerName}</h1>
          <p className="truncate text-body-xs text-text-muted">
            {groupName} ·{" "}
            <span className="inline-flex items-center gap-1">
              {isPrivate ? <Lock size={12} /> : <Users size={12} />}
              {isPrivate ? "خصوصی" : "گروهی"}
            </span>
            {closed && " · بسته"}
          </p>
        </div>
        <div className="size-10 shrink-0" />
      </header>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="کل هزینه‌ها"
          amount={totalSpent}
          tone="neutral"
          caption={`${toFarsi(expenseCount)} خرج ثبت‌شده`}
        />
        <StatCard
          label={netBalance >= 0 ? "خالص طلب شما" : "خالص بدهی شما"}
          amount={Math.abs(netBalance)}
          tone={netBalance >= 0 ? "positive" : "negative"}
          icon={netBalance >= 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
          caption={`سهم شما: ${toFarsi(String(myShare))}`}
        />
      </div>

      <section className="flex flex-col gap-3">
        <header className="flex items-center justify-between px-1">
          <h2 className="text-h4 font-semibold text-text">خرج‌ها</h2>
        </header>

        {errorMessage ? (
          <GlassCard padding="lg" radius="xl">
            <p role="alert" className="text-center text-body-sm text-negative-text">
              {errorMessage}
            </p>
          </GlassCard>
        ) : isLoading ? (
          <ExpensesSkeleton />
        ) : (
          <ExpensesList items={expenses} />
        )}
      </section>

      {!closed && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex justify-center px-4">
          <button
            type="button"
            onClick={onAddExpense}
            aria-label="ثبت خرج جدید"
            className="pointer-events-auto flex items-center gap-2 rounded-pill bg-accent text-text-on-accent px-6 h-14 shadow-[0_18px_40px_-15px_rgba(67,87,173,0.65)] hover:bg-accent-hover transition-colors cursor-pointer"
          >
            <Plus size={20} />
            <span className="text-label-lg font-semibold">ثبت خرج</span>
          </button>
        </div>
      )}
    </div>
  );
}

function ExpensesSkeleton() {
  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="rounded-card bg-surface border border-border p-4 space-y-3">
          <div className="flex justify-between">
            <div className="h-3.5 w-32 rounded-sm bg-border/60 animate-pulse" />
            <div className="h-3.5 w-20 rounded-sm bg-border/60 animate-pulse" />
          </div>
          <div className="h-3 w-40 rounded-sm bg-border/40 animate-pulse" />
        </li>
      ))}
    </ul>
  );
}