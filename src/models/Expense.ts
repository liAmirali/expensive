import { Model, Schema, SchemaTimestampsConfig, Types, model } from "mongoose";

export interface IExpense {
  value: number;
  currency?: string | null;
  category?: string;
  description?: string;
  createdBy: Types.ObjectId;
  dateTime: Date;
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
