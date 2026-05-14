import { X } from "lucide-react";

export interface MemberChipProps {
  name: string;
  onRemove?: () => void;
  tone?: "violet" | "teal" | "cerise" | "sand" | "ink";
}

const toneClass: Record<NonNullable<MemberChipProps["tone"]>, string> = {
  violet: "bg-[var(--p-violet-100)] text-[var(--p-violet-700)]",
  teal:   "bg-[var(--p-teal-50)]    text-[var(--p-teal-700)]",
  cerise: "bg-[var(--p-cerise-50)]  text-[var(--p-cerise-600)]",
  sand:   "bg-[var(--p-sand-100)]   text-[var(--p-sand-700)]",
  ink:    "bg-[var(--p-ink-100)]    text-[var(--p-ink-700)]",
};

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((s) => s[0] ?? "").join("").toUpperCase();

export function MemberChip({ name, onRemove, tone = "violet" }: MemberChipProps) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-pill ps-1.5 pe-3 py-1 ${toneClass[tone]}`}>
      <span className="flex size-6 items-center justify-center rounded-pill bg-white/60 text-label-xs font-bold">
        {initials(name) || "?"}
      </span>
      <span className="text-label-sm font-medium">{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`حذف ${name}`}
          className="flex size-5 items-center justify-center rounded-pill hover:bg-white/60 cursor-pointer"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
