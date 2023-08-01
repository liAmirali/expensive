import { Router } from "express";
import { createOccasion } from "../../../controller/group/occasion";
import { isAuth } from "../../../middlewares/authenticationHandler";
import { throwValidationError } from "../../../validators/utils";
import { createOccasionValidators } from "../../../validators/group";
import { asyncHandler } from "../../../utils/asyncHandler";

const router = Router();

router.post(
  "/",
  [isAuth, ...createOccasionValidators, throwValidationError],
  asyncHandler(createOccasion)
);

export default router;
