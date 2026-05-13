import { GlassCard } from "@/components/ui/GlassCard";
import { GroupListItem, type GroupListItemProps } from "@/components/ui/GroupListItem";

export interface GroupsListItem extends GroupListItemProps {
  id: string;
}

export interface GroupsListProps {
  items: GroupsListItem[];
  emptyMessage?: string;
}

export function GroupsList({
  items,
  emptyMessage = "هنوز عضو هیچ گروهی نیستید.",
}: GroupsListProps) {
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
            <GroupListItem {...item} />
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
