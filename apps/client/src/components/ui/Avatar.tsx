const initialsOf = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((s) => s[0] ?? "").join("").toUpperCase();

const toneClass = {
  violet: "bg-[var(--p-violet-100)] text-[var(--p-violet-700)]",
  teal:   "bg-[var(--p-teal-50)]    text-[var(--p-teal-700)]",
  cerise: "bg-[var(--p-cerise-50)]  text-[var(--p-cerise-600)]",
  sand:   "bg-[var(--p-sand-100)]   text-[var(--p-sand-700)]",
  ink:    "bg-[var(--p-ink-100)]    text-[var(--p-ink-700)]",
} as const;

const sizeClass = {
  sm: "size-7 text-overline",
  md: "size-9 text-label-xs",
  lg: "size-12 text-label-md",
} as const;

export type AvatarTone = keyof typeof toneClass;
export type AvatarSize = keyof typeof sizeClass;

export interface AvatarProps {
  name: string;
  tone?: AvatarTone;
  size?: AvatarSize;
}

export function Avatar({ name, tone = "violet", size = "md" }: AvatarProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-pill font-bold ${sizeClass[size]} ${toneClass[tone]}`}
    >
      {initialsOf(name) || "?"}
    </span>
  );
}
