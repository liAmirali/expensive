import { Request, Response } from "express";
import { Expense } from "../models/Expense";
import { ObjectId } from "mongodb";

export const addExpense = (req: Request, res: Response) => {
  const { value, category, description, currency } = req.body;

  const newExpense = new Expense({
    value,
    category,
    description,
    currency,
    created_by: new ObjectId("00000020"),
  });

  newExpense.save();

  return res.json({ message: "Expense was created successfully." });
};
