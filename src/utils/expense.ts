import { DebtsAndDemands, FilterExpenseArgs } from "../../types/expense";
import { IOccasionExpense } from "../models/group/OccasionExpense";

export const filterExpenses = (
  {
    minValue,
    maxValue,
    description,
    category,
    currency,
    startDate,
    endDate,
    paidBy,
    assignedTo,
  }: FilterExpenseArgs,
  expenses: IOccasionExpense[]
) => {
  return expenses.filter((item) => {
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
};

export const calculateDemandAndDebts = (
  expenses: IOccasionExpense[],
  loggedInUserId: string
): [IOccasionExpense[], DebtsAndDemands] => {
  const debtsAndDemands: DebtsAndDemands = {};
  const processedExpenses = [...expenses];

  for (let i = 0; i < processedExpenses.length; i++) {
    const expense = processedExpenses[i];

    const payerId = expense.paidBy.toString();
    if (!(payerId in debtsAndDemands)) debtsAndDemands[payerId] = { demand: 0, debt: 0 };

    debtsAndDemands[payerId].demand += expense.value;

    const eachPersonDong = expense.value / expense.assignedTo.length;

    expense.dong = eachPersonDong;
    if (payerId === loggedInUserId) {
      expense.demand =
        eachPersonDong * expense.assignedTo.length -
        (expense.assignedTo.map((i) => i.toString()).includes(payerId) ? eachPersonDong : 0);
    }

    for (let assignee of expense.assignedTo) {
      const assigneeId = assignee._id.toString();
      if (!(assigneeId in debtsAndDemands)) debtsAndDemands[assigneeId] = { demand: 0, debt: 0 };

      debtsAndDemands[assigneeId].debt += eachPersonDong;
    }
  }

  console.log("processedExpenses :>> ", processedExpenses);

  return [processedExpenses, debtsAndDemands];
};
