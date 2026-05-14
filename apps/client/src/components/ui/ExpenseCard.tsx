import { ArrowDownLeft, ArrowUpRight, MinusCircle, Users } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { formatToman, toFarsi } from "@/utils/numerals";

export type ExpenseCardDirection = "owed" | "owe" | "settled";

export interface ExpenseCardProps {
  title: string;
  description?: string;
  totalAmount: number;
  payerName: string;
  isPayerMe?: boolean;
  myShare: number;
  direction: ExpenseCardDirection;
  participantCount: number;
  dateLabel: string;
  onClick?: () => void;
}

const directionMeta: Record<
  ExpenseCardDirection,
  { label: (amt: string) => string; tone: string; icon: React.ReactNode }
> = {
  owed: {
    label: (amt) => `طلب شما ${amt}`,
    tone: "text-positive-text bg-[var(--p-teal-50)]",
    icon: <ArrowDownLeft size={14} />,
  },
  owe: {
    label: (amt) => `سهم شما ${amt}`,
    tone: "text-negative-text bg-[var(--p-cerise-50)]",
    icon: <ArrowUpRight size={14} />,
  },
  settled: {
    label: () => "تسویه",
    tone: "text-text-muted bg-bg",
    icon: <MinusCircle size={14} />,
  },
};

export function ExpenseCard({
  title,
  description,
  totalAmount,
  payerName,
  isPayerMe,
  myShare,
  direction,
  participantCount,
  dateLabel,
  onClick,
}: ExpenseCardProps) {
  const meta = directionMeta[direction];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-3 w-full text-start rounded-card bg-surface p-4 border border-border shadow-sm hover:bg-bg transition-colors cursor-pointer"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-md font-semibold text-text">{title}</p>
          {description && (
            <p className="truncate text-body-xs text-text-muted">{description}</p>
          )}
        </div>
        <p className="shrink-0 text-h4 font-bold tabular-nums tracking-tight text-text">
          {formatToman(totalAmount)}
        </p>
      </header>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={payerName} size="sm" tone={isPayerMe ? "violet" : "ink"} />
          <span className="truncate text-body-xs text-text-muted">
            {isPayerMe ? "شما" : payerName} پرداخت کرد
          </span>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-label-xs font-medium ${meta.tone}`}
        >
          {meta.icon}
          {meta.label(formatToman(myShare))}
        </span>
      </div>

      <footer className="flex items-center justify-between text-caption text-text-subtle">
        <span className="inline-flex items-center gap-1">
          <Users size={12} />
          {toFarsi(participantCount)} نفر
        </span>
        <span className="tabular-nums">{dateLabel}</span>
      </footer>
    </button>
  );
}