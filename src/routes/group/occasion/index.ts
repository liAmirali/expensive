import { Router } from "express";
import {
  addOccasionMembers as updateOccasionMembers,
  createOccasion,
  getOccasionMembers,
  getSingleOccasion,
  deleteOccasion,
} from "../../../controller/group/occasion";
import { isAuth } from "../../../middlewares/authenticationHandler";
import { throwValidationError } from "../../../validators/utils";
import {
  addOccasionMembersValidators as updateOccasionMembersValidators,
  createOccasionExpenseValidators,
  createOccasionValidators,
  deleteOccasionExpenseValidators,
  getOccasionExpensesValidators,
  getOccasionMembersValidators,
  getSingleOccasionValidators,
  updateOccasionExpenseValidators,
  deleteOccasionValidators,
} from "../../../validators/group/occasion";
import {
  createOccasionExpense,
  deleteOccasionExpense,
  getOccasionExpenses,
  updateOccasionExpense,
} from "../../../controller/group/occasion/expense";
import { asyncHandler } from "../../../utils/asyncHandler";

const router = Router();

router.get(
  "/:occasionId",
  [isAuth, ...getSingleOccasionValidators, throwValidationError],
  asyncHandler(getSingleOccasion)
);

router.post(
  "/",
  [isAuth, ...createOccasionValidators, throwValidationError],
  asyncHandler(createOccasion)
);

router.delete(
  "/:occasionId",
  [isAuth, ...deleteOccasionValidators, throwValidationError],
  asyncHandler(deleteOccasion)
);

router.get(
  "/:occasionId/members",
  [isAuth, ...getOccasionMembersValidators, throwValidationError],
  asyncHandler(getOccasionMembers)
);

router.put(
  "/:occasionId/members",
  [isAuth, ...updateOccasionMembersValidators, throwValidationError],
  asyncHandler(updateOccasionMembers)
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
