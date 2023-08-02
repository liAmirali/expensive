import { Router } from "express";
import { createOccasion } from "../../../controller/group/occasion";
import { isAuth } from "../../../middlewares/authenticationHandler";
import { throwValidationError } from "../../../validators/utils";
import {
  createOccasionExpenseValidators,
  createOccasionValidators,
  getOccasionExpensesValidators,
} from "../../../validators/group/occasion";
import {
  createOccasionExpense,
  getOccasionExpenses,
} from "../../../controller/group/occasion/expense";
import { asyncHandler } from "../../../utils/asyncHandler";

const router = Router();

router.post(
  "/",
  [isAuth, ...createOccasionValidators, throwValidationError],
  asyncHandler(createOccasion)
);

router.post(
  "/expense",
  [isAuth, ...createOccasionExpenseValidators, throwValidationError],
  asyncHandler(createOccasionExpense)
);

router.get(
  "/expense",
  [isAuth, ...getOccasionExpensesValidators, throwValidationError],
  asyncHandler(getOccasionExpenses)
);

export default router;
