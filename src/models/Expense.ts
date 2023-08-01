import { Model, Schema, model } from "mongoose";

export interface IExpense {
  value: number;
  currency?: string | null;
  category?: string;
  description?: string;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const expenseSchema = new Schema<IExpense>(
  {
    value: {
      type: Number,
      required: true,
      min: 0,
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

export const Expense: Model<IExpense> = model("Expense", expenseSchema);
