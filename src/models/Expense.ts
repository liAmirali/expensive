import { Model, Schema, Types, model } from "mongoose";

export const expenseSchema = new Schema<IPersonalExpense>(
  {
    type: {
      type: String,
      enum: ["EXPENSE", "INCOME"],
      default: "EXPENSE",
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
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

export const Expense: Model<IPersonalExpense> = model("Expense", expenseSchema);
