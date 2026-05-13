import { GlassCard } from "@/components/ui/GlassCard";
import { ExpenseListItem, type ExpenseListItemProps } from "@/components/ui/ExpenseListItem";

export interface RecentExpensesProps {
  title?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  items: (ExpenseListItemProps & { id: string })[];
  emptyMessage?: string;
}

export function RecentExpenses({
  title = "هزینه‌های اخیر",
  actionLabel = "مشاهده همه",
  onActionClick,
  items,
  emptyMessage = "هزینه‌ای ثبت نشده است.",
}: RecentExpensesProps) {
  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between px-1">
        <h2 className="text-h4 font-semibold text-text">{title}</h2>
        {onActionClick && (
          <button
            type="button"
            onClick={onActionClick}
            className="text-label-sm font-medium text-accent-text hover:underline underline-offset-4 cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
      </header>

      <GlassCard padding="none" radius="xl">
        {items.length === 0 ? (
          <p className="p-6 text-center text-body-sm text-text-muted">{emptyMessage}</p>
        ) : (
          <ul className="divide-y divide-border/60 p-2">
            {items.map(({ id, ...item }) => (
              <li key={id} className="py-1">
                <ExpenseListItem {...item} />
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </section>
  );
}
