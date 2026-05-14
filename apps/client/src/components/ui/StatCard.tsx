import type { ReactNode } from "react";
import { formatToman } from "@/utils/numerals";

export type StatTone = "positive" | "negative" | "neutral";

export interface StatCardProps {
  label: string;
  amount: number;
  tone: StatTone;
  icon?: ReactNode;
  caption?: string;
}

const toneClass: Record<StatTone, { bg: string; text: string; iconBg: string }> = {
  positive: {
    bg:     "bg-[var(--p-teal-50)]",
    text:   "text-positive-text",
    iconBg: "bg-positive text-text-on-accent",
  },
  negative: {
    bg:     "bg-[var(--p-cerise-50)]",
    text:   "text-negative-text",
    iconBg: "bg-negative text-text-on-accent",
  },
  neutral: {
    bg:     "bg-surface",
    text:   "text-text",
    iconBg: "bg-[var(--p-ink-100)] text-[var(--p-ink-700)]",
  },
};

export function StatCard({ label, amount, tone, icon, caption }: StatCardProps) {
  const styles = toneClass[tone];
  return (
    <div className={`rounded-card p-4 ${styles.bg} flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <p className="text-label-sm text-text-muted">{label}</p>
        {icon && (
          <span className={`flex size-8 items-center justify-center rounded-pill ${styles.iconBg}`}>
            {icon}
          </span>
        )}
      </div>
      <p className={`text-h3 font-bold tabular-nums tracking-tight ${styles.text}`}>
        {formatToman(amount)}
      </p>
      {caption && <p className="text-body-xs text-text-muted">{caption}</p>}
    </div>
  );
}
