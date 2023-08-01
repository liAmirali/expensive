import { Model, Schema, Types, model } from "mongoose";
export interface IUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  expenses: Types.ObjectId[];
  groups: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group"
    }
  ]
});

export const User: Model<IUser> = model("User", userSchema);