import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Group } from "../../../models/group/Group";
import { ApiError } from "../../../utils/errors";
import { Types } from "mongoose";

export const createOccasionExpense = async (req: Request, res: Response) => {
  const { groupId, occasionId, value, description, category, currency, paidBy, assignedTo } =
    matchedData(req) as {
      groupId: string;
      occasionId: string;
      value: number;
      description?: string;
      category?: string;
      currency?: string;
      paidBy: string;
      assignedTo: string[];
    };

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

  occasion.expenses.push({
    value,
    paidBy: new Types.ObjectId(paidBy),
    assignedTo: assignedTo.map((id) => new Types.ObjectId(id)),
    createdBy: new Types.ObjectId(userId),
    description,
    category,
    currency,
    dateTime: new Date(),
  });

  await group.save();

  return res.json({ message: "Expense created successfully." });
};


export const getOccasionExpenses = async (req: Request, res: Response) => {
  
}