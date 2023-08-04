import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Group } from "../../../models/group/Group";
import { ApiError, ApiRes } from "../../../utils/responses";
import { Types } from "mongoose";
import { IOccasionExpense } from "../../../models/group/OccasionExpense";

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

  const expenses = occasion.expenses as unknown as IOccasionExpense[];

  console.log("expenses:", expenses);

  const filteredExpenses = expenses.filter((item) => {
    // TODO: Refactor and outsource code to a function
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

    if (paidBy && item.paidBy.toString() !== paidBy) return false;

    if (assignedTo) {
      const occasionExpenseIds = item.assignedTo.map((objId) => objId.toString());
      for (let assignee of assignedTo) {
        if (!occasionExpenseIds.includes(assignee)) return false;
      }
    }

    return true;
  });

  console.log("filteredExpenses:", filteredExpenses);

  const demandsAndDebts: { [key: string]: { demand: number; debt: number } } = {};

  for (let expense of filteredExpenses) {
    const payerId = expense.paidBy.toString();
    if (!(payerId in demandsAndDebts)) demandsAndDebts[payerId] = { demand: 0, debt: 0 };

    demandsAndDebts[payerId].demand += expense.value;

    const eachPersonDong = expense.value / expense.assignedTo.length;

    for (let assignee of expense.assignedTo) {
      const assigneeId = assignee._id.toString();
      if (!(assigneeId in demandsAndDebts)) demandsAndDebts[assigneeId] = { demand: 0, debt: 0 };

      demandsAndDebts[assigneeId].debt += eachPersonDong;
    }
  }

  return res.json(
    new ApiRes("Expenses sent successfully.", {
      expenses: filteredExpenses,
      demandsAndDebts: demandsAndDebts,
    })
  );
};
