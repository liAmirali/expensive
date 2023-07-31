import mongoose, { Model, Schema } from "mongoose";

export interface IExpense {
  value: number;
  currency?: string | null;
  category?: string;
  description?: string;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

export const Expense: Model<IExpense> = mongoose.model("Expense", ExpenseSchema);
