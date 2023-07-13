import { Expense } from "./Expense";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  // expenses: [Expense],
});

export const User = mongoose.model("User", userSchema);
