import { GlassCard } from "@/components/ui/GlassCard";
import { ExpenseCard, type ExpenseCardProps } from "@/components/ui/ExpenseCard";

export interface ExpensesListItem extends ExpenseCardProps {
  id: string;
}

export interface ExpensesListProps {
  items: ExpensesListItem[];
  emptyMessage?: string;
}

export function ExpensesList({
  items,
  emptyMessage = "هنوز خرجی ثبت نشده است.",
}: ExpensesListProps) {
  if (items.length === 0) {
    return (
      <GlassCard padding="lg" radius="xl">
        <p className="text-center text-body-sm text-text-muted">{emptyMessage}</p>
      </GlassCard>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map(({ id, ...item }) => (
        <li key={id}>
          <ExpenseCard {...item} />
        </li>
      ))}
    </ul>
  );
}