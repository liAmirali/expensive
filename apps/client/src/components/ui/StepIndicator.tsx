import { toFarsi } from "@/utils/numerals";

export interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <span className="text-body-xs text-text-muted tabular-nums">
      گام {toFarsi(current)} از {toFarsi(total)}
    </span>
  );
}
