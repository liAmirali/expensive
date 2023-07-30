import { Request, Response } from "express";
import { Expense } from "../models/Expense";
import { ObjectId } from "mongodb";
import { User } from "../models/User";
import { ApiError } from "../utils/errors";

export const addExpense = async (req: Request, res: Response) => {
  const { value, category, description, currency } = req.body;

  const userId = req.user!.userId; // We authenticate user in a middleware so the user object definitely exists

  const newExpense = new Expense({
    value,
    category,
    description,
    currency,
    created_by: new ObjectId(userId),
  });

  if (!userId) {
    const error = new ApiError("User not found.");
    error.statusCode = 401;
    throw error;
  }
  const found = await User.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $push: {
        expenses: newExpense,
      },
    }
  );
  if (found === null) {
    const error = new ApiError("Couldn't update user.");
    error.statusCode = 500;
    throw error;
  }

  newExpense.save();

  return res.json({ message: "Expense was created successfully." });
};
