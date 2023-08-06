import { Model, Schema, Types, model } from "mongoose";
import { getEnumValues } from "../utils/getters";

export enum ExpenseType {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
}
export interface IExpense {
  value: number;
  type?: string;
  currency: string;
  title: string;
  category?: string;
  description?: string;
  createdBy: Types.ObjectId;
  dateTime: Date;
}

export const expenseSchema = new Schema<IExpense>(
  {
    type: {
      type: String,
      enum: getEnumValues(ExpenseType) as string[],
      default: ExpenseType.EXPENSE,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

export const Expense: Model<IExpense> = model("Expense", expenseSchema);
