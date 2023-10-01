import { Model, Schema, Types, model } from "mongoose";
import { IExpense, expenseSchema } from "./Expense";
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  expenses?: IExpense[];
  groups: Types.ObjectId[];

  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpiration?: number;
  resetPassToken?: string;
  resetPassTokenExpiration?: number;
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
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, select: false },
  emailVerificationTokenExpiration: {type: Date, select: false},
  resetPassToken: { type: String, select: false },
  resetPassTokenExpiration: { type: Date, select: false },
});

export const User: Model<IUser> = model("User", userSchema);
