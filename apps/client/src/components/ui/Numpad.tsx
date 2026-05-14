import { Delete } from "lucide-react";
import { toFarsi } from "@/utils/numerals";

export interface NumpadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onTripleZero: () => void;
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function Numpad({ onDigit, onBackspace, onTripleZero }: NumpadProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {DIGITS.map((d) => (
        <NumpadKey key={d} onClick={() => onDigit(d)}>
          {toFarsi(d)}
        </NumpadKey>
      ))}
      <NumpadKey onClick={onTripleZero} aria-label="سه صفر">
        ۰۰۰
      </NumpadKey>
      <NumpadKey onClick={() => onDigit("0")}>{toFarsi("0")}</NumpadKey>
      <NumpadKey onClick={onBackspace} aria-label="حذف">
        <Delete size={22} />
      </NumpadKey>
    </div>
  );
}

function NumpadKey({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="flex h-14 items-center justify-center rounded-card bg-surface text-h3 font-semibold text-text shadow-sm border border-border hover:bg-bg active:scale-[0.98] transition cursor-pointer"
      {...rest}
    >
      {children}
    </button>
  );
}
