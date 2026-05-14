import { GlassCard } from "@/components/ui/GlassCard";
import { LedgerListItem, type LedgerListItemProps } from "@/components/ui/LedgerListItem";

export interface LedgersListItem extends LedgerListItemProps {
  id: string;
}

export interface LedgersListProps {
  items: LedgersListItem[];
  emptyMessage?: string;
}

export function LedgersList({
  items,
  emptyMessage = "هنوز دفتری در این گروه ساخته نشده است.",
}: LedgersListProps) {
  if (items.length === 0) {
    return (
      <GlassCard padding="lg" radius="xl">
        <p className="text-center text-body-sm text-text-muted">{emptyMessage}</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="none" radius="xl">
      <ul className="divide-y divide-border/60 p-2">
        {items.map(({ id, ...item }) => (
          <li key={id} className="py-1">
            <LedgerListItem {...item} />
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
