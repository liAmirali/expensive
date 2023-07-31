import { Model, Schema, model } from "mongoose";
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  expenses: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
});

export const User: Model<IUser> = model("User", userSchema);
