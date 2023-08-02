import { NextFunction, Request, Response } from "express";
import { Expense, IExpense } from "../models/Expense";
import { ObjectId } from "mongodb";
import { IUser, User } from "../models/User";
import { ApiError } from "../utils/errors";

export const getExpense = async (req: Request, res: Response, next: NextFunction) => {
  const { minValue, maxValue, description, category, currency, endDate, startDate } =
    req.query as unknown as {
      minValue: number;
      maxValue: number;
      description: string;
      category: string;
      currency: string;
      startDate: string;
      endDate: string;
    }; // TODO: Export this into an interface

  console.log("req.query :>> ", req.query);
  // let minValueNumber = minValue as number;

  const userId = req.user?.userId;
  const user = (await User.findById(userId).populate({
    path: "expenses",
    model: "Expense",
  })) as IUser & { expenses: IExpense[] };
  if (user === null) {
    const error = new ApiError("User was not found.", 401);
    return next(error);
  }
  // Optional Filtering
  const { expenses } = user;
  const filteredExpenses = expenses.filter((item: IExpense) => {
    // Filtering for the value range
    if (minValue && maxValue) {
      if (item.value < minValue || item.value > maxValue) return false;
    } else if (minValue) {
      if (item.value < minValue) return false;
    } else if (maxValue) {
      if (item.value > maxValue) return false;
    }

    // Expense description must contain the description filter provided
    if (description && item.description && !item.description.includes(description)) return false;

    // Expense category must be equal to the category filter provided
    if (category && item.category && item.category !== category) return false;

    // Expense currency must be equal to the currency filter provided
    if (currency && item.currency && item.currency !== currency) return false;

    // Filtering for the expense date
    console.log("item.dateTime :>> ", item.dateTime);
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      if (item.dateTime > endDateObj || item.dateTime < startDateObj) return false;
    } else if (startDate) {
      const startDateObj = new Date(startDate);
      if (item.dateTime < startDateObj) return false;
    } else if (endDate) {
      const endDateObj = new Date(endDate);
      if (item.dateTime > endDateObj) return false;
    }

    return true;
  });

  console.log("filteredExpenses :>> ", filteredExpenses);

  return res.json({ message: "Expenses was sent successfully.", data: filteredExpenses });
};

export const addExpense = async (req: Request, res: Response, next: NextFunction) => {
  const { value, category, description, currency } = req.body;

  const userId = req.user!.userId; // We authenticate user in a middleware so the user object definitely exists

  const newExpense = new Expense({
    value,
    category,
    description,
    currency,
    createdBy: new ObjectId(userId),
  });

  if (!userId) {
    const error = new ApiError("User not found.");
    error.statusCode = 401;
    return next(error);
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
    return next(error);
  }

  newExpense.save();

  return res.json({ message: "Expense was created successfully." });
};

export const editExpense = async (req: Request, res: Response, next: NextFunction) => {
  const { id, value, description, category, currency } = req.body;

  const expense = await Expense.findByIdAndUpdate(id, {
    $set: {
      value,
      description,
      category,
      currency,
    },
  });

  if (expense === null) {
    const error = new ApiError("Expense was not found.");
    error.statusCode = 404;
    return next(error);
  }

  return res.json({ message: "Expense was updated successfully." });
};

export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;

  const expense = await Expense.findByIdAndDelete(id);
  console.log("DELETION RESULT:", expense);
  if (expense === null) {
    const error = new ApiError("Expense was not found.");
    error.statusCode = 404;
    return next(error);
  }

  return res.json({ message: "Expense was deleted successfully." });
};
