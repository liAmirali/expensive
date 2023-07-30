import mongoose, { Model, Schema } from "mongoose";

interface IExpense {
  value: number;
  currency?: string | null;
  category?: string;
  description?: string;
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
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

export const Expense: Model<IExpense> = mongoose.model("Expense", ExpenseSchema);
