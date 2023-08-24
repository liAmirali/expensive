import { Model, Schema, Types, model } from "mongoose";
import { ExpenseType, IExpense, expenseSchema } from "./Expense";
export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  expenses?: IExpense[];
  groups: Types.ObjectId[];
}

export const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, minlength: 4 },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  expenses: [{ type: expenseSchema, select: false }],
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
      select: false,
    },
  ],
});

export const User: Model<IUser> = model("User", userSchema);
