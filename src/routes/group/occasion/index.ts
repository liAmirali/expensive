import { Router } from "express";
import {
  createOccasion,
  getOccasionMembers,
  getSingleOccasion,
} from "../../../controller/group/occasion";
import { isAuth } from "../../../middlewares/authenticationHandler";
import { throwValidationError } from "../../../validators/utils";
import {
  createOccasionExpenseValidators,
  createOccasionValidators,
  deleteOccasionExpenseValidators,
  getOccasionExpensesValidators,
  getOccasionMembersValidators,
  getSingleOccasionValidators,
  updateOccasionExpenseValidators,
} from "../../../validators/group/occasion";
import {
  createOccasionExpense,
  deleteOccasionExpense,
  getOccasionExpenses,
  updateOccasionExpense,
} from "../../../controller/group/occasion/expense";
import { asyncHandler } from "../../../utils/asyncHandler";

const router = Router();

router.post(
  "/",
  [isAuth, ...createOccasionValidators, throwValidationError],
  asyncHandler(createOccasion)
);

router.get(
  "/:occasionId",
  [isAuth, ...getSingleOccasionValidators, throwValidationError],
  asyncHandler(getSingleOccasion)
);

router.get(
  "/:occasionId/members",
  [isAuth, ...getOccasionMembersValidators, throwValidationError],
  asyncHandler(getOccasionMembers)
);

router.post(
  "/:occasionId/expense",
  [isAuth, ...createOccasionExpenseValidators, throwValidationError],
  asyncHandler(createOccasionExpense)
);

router.get(
  "/:occasionId/expense",
  [isAuth, ...getOccasionExpensesValidators, throwValidationError],
  asyncHandler(getOccasionExpenses)
);

router.patch(
  "/:occasionId/expense",
  [isAuth, ...updateOccasionExpenseValidators, throwValidationError],
  asyncHandler(updateOccasionExpense)
);

router.delete(
  "/:occasionId/expense",
  [isAuth, ...deleteOccasionExpenseValidators],
  asyncHandler(deleteOccasionExpense)
);

export default router;
