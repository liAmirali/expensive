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
  createOccasionValidators,
  getOccasionMembersValidators,
  getSingleOccasionValidators,
  deleteOccasionValidators,
} from "../../../validators/group/occasion";
import { clearDebt } from "../../../controller/group/occasion/expense";
import { asyncHandler } from "../../../utils/asyncHandler";
import { clearDebtValidators } from "../../../validators/expense";
import expenseRouter from "./expense";

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
  "/:occasionId/clear-debt",
  [isAuth, ...clearDebtValidators, throwValidationError],
  asyncHandler(clearDebt)
);

router.use("/:occasionId/expense", expenseRouter);

export default router;
