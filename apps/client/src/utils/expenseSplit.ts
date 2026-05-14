export type SplitShare = { userId: string; amountOwed: string };

export const equalSplit = (totalAmount: number, participantIds: string[]): SplitShare[] => {
  if (participantIds.length === 0 || totalAmount <= 0) return [];
  const base = Math.floor(totalAmount / participantIds.length);
  const remainder = totalAmount - base * participantIds.length;
  return participantIds.map((userId, i) => ({
    userId,
    amountOwed: String(base + (i < remainder ? 1 : 0)),
  }));
};
