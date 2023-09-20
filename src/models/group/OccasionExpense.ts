import { Model, Schema, Types } from "mongoose";
import { Expense, IExpense } from "../Expense";

export interface IOccasionExpense extends IExpense {
  paidBy: Types.ObjectId;
  assignedTo: Types.ObjectId[];
  dong?: number;
  demand?: number;
}

export const occasionExpenseSchema = new Schema<IOccasionExpense>({
  paidBy: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  assignedTo: [
    {
      type: Schema.Types.ObjectId,
      required: true,
    },
  ],
});
