import { evaluatePassword, STRENGTH_LABEL_FA, type PasswordStrength as Level } from "@/utils/password";

interface Props {
  value: string;
}

const SEGMENTS = 3;

const LEVEL_TO_FILLED: Record<Level, number> = {
  empty: 0,
  weak: 1,
  moderate: 2,
  strong: 3,
};

const LEVEL_TO_COLOR: Record<Level, string> = {
  empty:    "bg-border",
  weak:     "bg-negative",
  moderate: "bg-warning",
  strong:   "bg-positive",
};

const LEVEL_TO_TEXT: Record<Level, string> = {
  empty:    "text-text-subtle",
  weak:     "text-negative-text",
  moderate: "text-warning-text",
  strong:   "text-positive-text",
};

export function PasswordStrength({ value }: Props) {
  const { strength } = evaluatePassword(value);
  const filled = LEVEL_TO_FILLED[strength];
  const label  = STRENGTH_LABEL_FA[strength];

  return (
    <div className="flex flex-col gap-2 mt-1" aria-live="polite">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const active = i < filled;
          return (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-pill transition-colors duration-300 ${
                active ? LEVEL_TO_COLOR[strength] : "bg-border"
              }`}
            />
          );
        })}
      </div>
      {label && (
        <p className={`text-label-xs font-medium transition-colors duration-300 ${LEVEL_TO_TEXT[strength]}`}>
          قدرت رمز عبور: {label}
        </p>
      )}
    </div>
  );
}
