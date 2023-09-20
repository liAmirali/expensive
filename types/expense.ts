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

export type DebtsAndDemands = { [key: string]: { demand: number; debt: number } };
