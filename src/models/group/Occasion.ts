import { Schema, Types } from "mongoose";
import { IOccasionExpense, occasionExpenseSchema } from "./OccasionExpense";
import { expenseSchema } from "../Expense";
import { DebtsAndDemands } from "../../../types/expense";

export interface IOccasion {
  _id?: Types.ObjectId;
  name: string;
  members: Types.ObjectId[];
  expenses?: IOccasionExpense[];
  debtsAndDemands?: DebtsAndDemands;
}

export const occasionSchema = new Schema<IOccasion>({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  expenses: [expenseSchema],
});

occasionSchema
  .path<Schema.Types.Subdocument>("expenses")
  .discriminator("OccasionExpense", occasionExpenseSchema);
