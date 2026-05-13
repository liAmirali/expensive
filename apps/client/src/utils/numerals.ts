const EN_TO_FA: Record<string, string> = {
  "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴",
  "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹",
} as const;

export const toFarsi = (input: string | number): string =>
  String(input).replace(/[0-9]/g, (d) => EN_TO_FA[d] ?? d);

export const formatToman = (amount: number, { sign = false }: { sign?: boolean } = {}): string => {
  const abs = Math.abs(Math.trunc(amount));
  const grouped = abs.toLocaleString("en-US");
  const prefix = sign ? (amount > 0 ? "+" : amount < 0 ? "−" : "") : amount < 0 ? "−" : "";
  return `${prefix}${toFarsi(grouped)} تومان`;
};