import { Router } from "express";
import { isAuth } from "../../../../middlewares/authenticationHandler";
import { throwValidationError } from "../../../../validators/utils";
import { asyncHandler } from "../../../../utils/asyncHandler";
import {
  createOccasionExpenseValidators,
  deleteOccasionExpenseValidators,
  getOccasionExpensesValidators,
  getSingleOccasionExpenseValidators,
  updateOccasionExpenseValidators,
} from "../../../../validators/group/occasionExpense";
import {
  createOccasionExpense,
  deleteOccasionExpense,
  getOccasionExpenses,
  getSingleOccasionExpense,
  updateOccasionExpense,
} from "../../../../controller/group/occasion/expense";

const router = Router({ mergeParams: true });

router.post(
  "/",
  [isAuth, ...createOccasionExpenseValidators, throwValidationError],
  asyncHandler(createOccasionExpense)
);

router.get(
  "/",
  [isAuth, ...getOccasionExpensesValidators, throwValidationError],
  asyncHandler(getOccasionExpenses)
);

router.get(
  "/:expenseId",
  [isAuth, ...getSingleOccasionExpenseValidators, throwValidationError],
  asyncHandler(getSingleOccasionExpense)
);

router.patch(
  "/",
  [isAuth, ...updateOccasionExpenseValidators, throwValidationError],
  asyncHandler(updateOccasionExpense)
);

router.delete(
  "/",
  [isAuth, ...deleteOccasionExpenseValidators, throwValidationError],
  asyncHandler(deleteOccasionExpense)
);

export default router;
