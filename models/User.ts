import mongoose, { Model, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  // expenses: [Expense],
});

export const User: Model<IUser> = mongoose.model("User", userSchema);
