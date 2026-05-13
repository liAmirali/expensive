import type { ReactNode } from "react";
import { formatToman, toFarsi } from "@/utils/numerals";

export type ExpenseDirection = "owed" | "owe" | "settled";

export interface ExpenseListItemProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  amount: number;
  direction: ExpenseDirection;
  timeLabel?: string;
  iconTone?: "violet" | "teal" | "cerise" | "sand" | "ink";
}

const toneClass: Record<NonNullable<ExpenseListItemProps["iconTone"]>, string> = {
  violet: "bg-[var(--p-violet-100)] text-[var(--p-violet-700)]",
  teal:   "bg-[var(--p-teal-50)]    text-[var(--p-teal-700)]",
  cerise: "bg-[var(--p-cerise-50)]  text-[var(--p-cerise-600)]",
  sand:   "bg-[var(--p-sand-100)]   text-[var(--p-sand-700)]",
  ink:    "bg-[var(--p-ink-100)]    text-[var(--p-ink-700)]",
};

const amountClass: Record<ExpenseDirection, string> = {
  owed:    "text-positive-text",
  owe:     "text-negative-text",
  settled: "text-text-muted",
};

export function ExpenseListItem({
  icon,
  title,
  subtitle,
  amount,
  direction,
  timeLabel,
  iconTone = "violet",
}: ExpenseListItemProps) {
  const signed = direction === "owe" ? -Math.abs(amount) : Math.abs(amount);

  return (
    <div className="flex items-center gap-3 rounded-card bg-surface p-3 transition-colors hover:bg-bg">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-pill ${toneClass[iconTone]}`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-body-md font-medium text-text">{title}</p>
        {subtitle && (
          <p className="truncate text-body-xs text-text-muted">{subtitle}</p>
        )}
      </div>

      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <p className={`text-label-md font-semibold tabular-nums ${amountClass[direction]}`}>
          {formatToman(signed, { sign: direction !== "settled" })}
        </p>
        {timeLabel && (
          <p className="text-caption text-text-subtle tabular-nums">{toFarsi(timeLabel)}</p>
        )}
      </div>
    </div>
  );
}
