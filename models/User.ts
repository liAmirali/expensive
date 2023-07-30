import mongoose, { Model, Schema } from "mongoose";
interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  expenses: Schema.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
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

export const User: Model<IUser> = mongoose.model("User", userSchema);
