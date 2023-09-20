import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Group } from "../../../models/group/Group";
import { ApiError, ApiRes } from "../../../utils/responses";
import { Types } from "mongoose";
import { IOccasionExpense } from "../../../models/group/OccasionExpense";
import { calculateDemandAndDebts, filterExpenses } from "../../../utils/expense";

export const createOccasionExpense = async (req: Request, res: Response) => {
  const { groupId, occasionId, value, title, description, category, currency, paidBy, assignedTo } =
    matchedData(req) as {
      groupId: string;
      occasionId: string;
      value: number;
      title: string;
      currency: string;
      description?: string;
      category?: string;
      paidBy: string;
      assignedTo: string[];
    };

  console.log("req.body:", req.body);

  const userId = req.user!.userId;

  const group = await Group.findById(groupId).select("occasions");
  if (group === null) {
    throw new ApiError("No group was found.", 404);
  }

  const occasion = group.occasions.find((item) => item._id!.toString() === occasionId);
  if (!occasion) {
    throw new ApiError("Occasion does not exist in the group.", 404);
  }

  console.log("OCCASION:", occasion);

  // Checking if the expense creator is inside the occasion
  const existingCreator = occasion.members.find((item) => item._id.toString() === userId);
  if (!existingCreator) {
    throw new ApiError("User is not authorized.", 401);
  }

  // Checking if the payer is in the occasion
  const existingPayer = occasion.members.find((item) => item._id.toString() === paidBy);
  if (!existingPayer) {
    throw new ApiError("Payer must be among the occasion members.", 422);
  }

  // Checking if the assignees are all in the occasion
  assignedTo.forEach((id) => {
    const existingAssignee = occasion.members.find((item) => item._id.toString() === id);
    if (!existingAssignee) {
      throw new ApiError("All the assignees must be among the occasion members.", 422);
    }
  });

  if (!occasion.expenses) occasion.expenses = [];

  const newExpense = {
    value,
    paidBy: new Types.ObjectId(paidBy),
    assignedTo: assignedTo.map((id) => new Types.ObjectId(id)),
    createdBy: new Types.ObjectId(userId),
    title,
    description,
    category,
    currency,
    dateTime: new Date(),
    __t: "OccasionExpense",
  };

  occasion.expenses.push(newExpense);

  // await newExpense.save();
  console.log("HERE1");
  await group.save();
  console.log("HERE2");

  return res.json(new ApiRes("Expense created successfully.", { expense: newExpense }));
};

export const getOccasionExpenses = async (req: Request, res: Response) => {
  const {
    groupId,
    occasionId,
    minValue,
    maxValue,
    description,
    category,
    currency,
    startDate,
    endDate,
    paidBy,
    assignedTo,
  } = matchedData(req) as {
    groupId: string;
    occasionId: string;
    minValue?: number;
    maxValue?: number;
    description?: string;
    category?: string;
    currency?: string;
    endDate?: string;
    startDate?: string;
    paidBy?: string;
    assignedTo?: string[];
  };

  const group = await Group.findById(groupId).select("occasions");
  if (group === null) {
    throw new ApiError("No group was found with this ID.", 404);
  }

  const occasion = group.occasions.find((occasion) => occasion._id!.toString() === occasionId);
  if (!occasion) {
    throw new ApiError("Occasion does not exist in the group.", 404);
  }

  console.log("OCCASION:", occasion);

  if (!occasion.expenses) {
    throw new ApiError("No expenses was found.", 404);
  }

  console.log("expenses:", occasion.expenses);

  const filteredExpenses = filterExpenses(
    { minValue, maxValue, description, category, currency, startDate, endDate, paidBy, assignedTo },
    occasion.expenses
  );

  console.log("filteredExpenses:", filteredExpenses);

  const debtsAndDemands = calculateDemandAndDebts(filteredExpenses);

  return res.json(
    new ApiRes("Expenses sent successfully.", {
      expenses: filteredExpenses,
      debtsAndDemands: debtsAndDemands,
    })
  );
};
