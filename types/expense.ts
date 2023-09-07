export type FilterExpenseArgs = {
  minValue?: number;
  maxValue?: number;
  description?: string;
  category?: string;
  currency?: string;
  endDate?: string;
  startDate?: string;
  paidBy?: string;
  assignedTo?: string[];
};
