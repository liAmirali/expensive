export type PasswordStrength = "empty" | "weak" | "moderate" | "strong";

export interface PasswordEvaluation {
  strength: PasswordStrength;
  score: number;
  checks: {
    length:    boolean;
    lowercase: boolean;
    uppercase: boolean;
    digit:     boolean;
    symbol:    boolean;
  };
}

export function evaluatePassword(value: string): PasswordEvaluation {
  if (!value) {
    return {
      strength: "empty",
      score: 0,
      checks: { length: false, lowercase: false, uppercase: false, digit: false, symbol: false },
    };
  }

  const checks = {
    length:    value.length >= 8,
    lowercase: /[a-z]/.test(value),
    uppercase: /[A-Z]/.test(value),
    digit:     /\d/.test(value),
    symbol:    /[^A-Za-z0-9]/.test(value),
  };

  const passed = Object.values(checks).filter(Boolean).length;
  let strength: PasswordStrength = "weak";
  if (passed >= 5 && value.length >= 12) strength = "strong";
  else if (passed >= 3 && checks.length) strength = "moderate";

  return { strength, score: passed, checks };
}

export const STRENGTH_LABEL_FA: Record<PasswordStrength, string> = {
  empty:    "",
  weak:     "ضعیف",
  moderate: "متوسط",
  strong:   "قوی",
};
