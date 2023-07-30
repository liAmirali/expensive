import mongoose, { Model, Schema } from "mongoose";

const EXPENSE_MODEL = "Expense";

interface IExpense {
  value: number;
  currency: string;
  category: string;
  description: string;
  created_by: Schema.Types.ObjectId;
}

const ExpenseSchema = new mongoose.Schema<IExpense>(
  {
    value: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      require: true,
    },
  },
  { timestamps: true }
);

export const Expense: Model<IExpense> = mongoose.model(EXPENSE_MODEL, ExpenseSchema);
