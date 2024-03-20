type ExpenseType = "EXPENSE" | "INCOME";

interface IBaseExpense {
  _id?: import("mongoose").Types.ObjectId;
  value: number;
  type?: string;
  currency: string;
  title: string;
  category?: string;
  description?: string;
  createdBy: import("mongoose").Types.ObjectId;
  dateTime: Date;
}

interface IPersonalExpense extends IBaseExpense {}

interface IOccasionExpense extends IBaseExpense {
  paidBy: import("mongoose").Types.ObjectId;
  assignedTo: import("mongoose").Types.ObjectId[];
  dong?: number;
  demand?: number;
  occasionId: import("mongoose").Types.ObjectId;
}

type FilterExpenseArgs = {
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

type DebtsAndDemands = { [key: string]: { demand: number; debt: number } };
