import type { ReactNode } from "react";
import { formatToman } from "@/utils/numerals";

export interface BalanceCardProps {
  label: string;
  amount: number;
  caption?: ReactNode;
  trailing?: ReactNode;
}

export function BalanceCard({ label, amount, caption, trailing }: BalanceCardProps) {
  return (
    <div className="relative overflow-hidden rounded-sheet bg-[var(--p-ink-950)] text-white p-6 shadow-[0_20px_60px_-20px_rgba(11,0,20,0.45)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -start-12 size-56 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(closest-side, var(--p-violet-400), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -end-10 size-64 rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(closest-side, var(--p-cerise-400), transparent 70%)" }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-label-sm text-white/60">{label}</p>
          <p className="mt-2 text-display-sm font-bold tracking-tight tabular-nums">
            {formatToman(amount, { sign: true })}
          </p>
          {caption && <p className="mt-2 text-body-sm text-white/70">{caption}</p>}
        </div>
        {trailing}
      </div>
    </div>
  );
}
