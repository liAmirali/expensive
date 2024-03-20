import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Group } from "../../../models/group/Group";
import { ApiError, ApiRes } from "../../../utils/responses";
import { Types } from "mongoose";
import { calculateDemandAndDebts, filterExpenses } from "../../../utils/expense";
import { OccasionExpense } from "../../../models/group/OccasionExpense";
import { IOccasion } from "../../../models/group/Occasion";

export const createOccasionExpense = async (req: Request, res: Response) => {
  const { groupId, occasionId, value, title, description, category, currency, paidBy, assignedTo } =
    matchedData(req, { locations: ["params", "body"] }) as {
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

  const userId = req.user!.userId;

  const group = await Group.findById(groupId).select("occasions");
  if (group === null) {
    throw new ApiError("No group was found.", 404);
  }

  const occasion = group.occasions.find((item) => item._id!.toString() === occasionId);
  if (!occasion) {
    throw new ApiError("Occasion does not exist in the group.", 404);
  }

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

  const newExpense: IOccasionExpense = {
    value,
    paidBy: new Types.ObjectId(paidBy),
    assignedTo: assignedTo.map((id) => new Types.ObjectId(id)),
    createdBy: new Types.ObjectId(userId),
    title,
    description,
    category,
    currency,
    dateTime: new Date(),
    occasionId: new Types.ObjectId(occasion._id),
  };

  const newOccasionExpense = new OccasionExpense(newExpense);
  occasion.expenses.push(newOccasionExpense._id);

  await group.save();
  await newOccasionExpense.save();

  return res.json(new ApiRes("Expense created successfully.", { expense: newExpense }));
};

export const getOccasionExpenses = async (req: Request, res: Response) => {
  const { userId } = req.user!;
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
  } = matchedData(req, { locations: ["params", "query"] }) as {
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

  const group = await Group.findById(groupId)
    .select("occasions")
    .populate<{ occasions: (IOccasion & { expenses: IOccasionExpense[] })[] }>(
      "occasions.expenses"
    );
  if (group === null) {
    throw new ApiError("No group was found with this ID.", 404);
  }

  const occasion = group.occasions.find((occasion) => occasion._id!.toString() === occasionId);
  if (!occasion) {
    throw new ApiError("Occasion does not exist in the group.", 404);
  }

  if (!occasion.expenses) {
    throw new ApiError("No expenses was found.", 404);
  }

  const filteredExpenses = filterExpenses(
    { minValue, maxValue, description, category, currency, startDate, endDate, paidBy, assignedTo },
    occasion.expenses
  );

  const [_, debtsAndDemands] = calculateDemandAndDebts(filteredExpenses, userId);

  return res.json(
    new ApiRes("Expenses sent successfully.", {
      expenses: filteredExpenses,
      debtsAndDemands: debtsAndDemands,
    })
  );
};

export const getSingleOccasionExpense = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { expenseId } = matchedData(req);

  const occasionExpense = await OccasionExpense.findById(expenseId)
    .populate("createdBy")
    .populate("paidBy")
    .populate("assignedTo");
  if (!occasionExpense) {
    throw new ApiError("Occasion Expense was not found.", 404);
  }
  const group = await Group.findOne({ "occasions._id": occasionExpense.occasionId });
  const occasion = group?.occasions.find(
    (occ) => occ._id!.toString() === occasionExpense.occasionId.toString()
  );
  if (!occasion) {
    throw new ApiError("Occasion of the expense was not found.", 404);
  }

  let userIsAuthorized = false;
  for (let i = 0; i < occasion.members.length; i++) {
    if (occasion.members[i]._id.toString() === userId) {
      userIsAuthorized = true;
      break;
    }
  }
  if (!userIsAuthorized) {
    throw new ApiError("User is not authorized.", 403);
  }

  return res.json(new ApiRes("Expense fetched successfully.", { expense: occasionExpense }));
};

export const updateOccasionExpense = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const {
    groupId,
    occasionId,
    expenseId,
    value,
    title,
    description,
    category,
    currency,
    paidBy,
    assignedTo,
  } = matchedData(req, { locations: ["params", "body"] }) as {
    groupId: string;
    occasionId: string;
    expenseId: string;
    value?: number;
    title?: string;
    currency?: string;
    description?: string;
    category?: string;
    paidBy?: string;
    assignedTo?: string[];
  };

  const group = await Group.findById(groupId)
    .populate<{ occasions: ({ expenses: IOccasionExpense[] } & IOccasion)[] }>("occasions.expenses")
    .select("occasions");
  if (!group) {
    throw new ApiError("Group ID was not found.", 404);
  }

  const occasion = group.occasions.find((occasion) => occasion._id!.toString() === occasionId);
  if (!occasion) {
    throw new ApiError("Occasion ID was not found.", 404);
  }

  const expense = occasion.expenses?.find((expense) => expense._id!.toString() === expenseId);
  if (!expense) {
    throw new ApiError("Expense ID was not found.", 404);
  }

  if (value) expense.value = value;
  if (title) expense.title = title;
  if (currency) expense.currency = currency;
  if (description) expense.description = description;
  if (category) expense.category = category;
  if (paidBy) {
    const payerExists = occasion.members.find((member) => member._id.toString() === paidBy);
    if (!payerExists) {
      throw new ApiError("Payer must be among the occasion members.", 403);
    }
    expense.paidBy = new Types.ObjectId(paidBy);
  }
  if (assignedTo) {
    for (const assigneeId of assignedTo) {
      const assigneeExists = occasion.members.find(
        (member) => member._id.toString() === assigneeId
      );
      if (!assigneeExists) {
        throw new ApiError(
          `All assignees must be among the occasions; but ${assigneeId} is not.`,
          403
        );
      }
    }

    expense.assignedTo = assignedTo.map((id) => new Types.ObjectId(id));
  }

  await group.save();

  return res.json(new ApiRes("Expense was updated successfully", { expense }));
};

export const deleteOccasionExpense = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { groupId, occasionId, expenseId } = matchedData(req);

  const group = await Group.findById(groupId).select("occasions");
  if (!group) {
    throw new ApiError("Group ID was not found.", 404);
  }

  const occasion = group.occasions.find((occasion) => occasion._id!.toString() === occasionId);
  if (!occasion) {
    throw new ApiError("Occasion ID was not found.", 404);
  }

  let userIsAuthorized = false;
  for (let i = 0; i < occasion.members.length; i++) {
    if (occasion.members[i]._id.toString() === userId) {
      userIsAuthorized = true;
      break;
    }
  }
  if (!userIsAuthorized) {
    throw new ApiError("User is not authorized.", 403);
  }

  const expense = occasion.expenses?.find((expense) => expense._id!.toString() === expenseId);
  if (!expense) {
    throw new ApiError("Expense ID was not found.", 404);
  }

  await Group.findOneAndUpdate(
    { _id: groupId, "occasions._id": occasionId },
    {
      $pull: {
        "occasions.$.expenses": {
          _id: expenseId,
        },
      },
    }
  );

  return res.json(new ApiRes("Expense was deleted successfully"));
};

export const clearDebt = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { groupId, occasionId, expenseId } = matchedData(req);

  const expense = await Group.find({
    _id: groupId,
    "occasions.$._id": occasionId,
    "occasions.$.expenses.$._id": expenseId,
  });

  return res.send("OK");
};
