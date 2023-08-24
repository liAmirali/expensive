import { Router } from "express";
import { searchUsers } from "../controller/user";
import { isAuth } from "../middlewares/authenticationHandler";
import { throwValidationError } from "../validators/utils";
import { searchUsersValidators } from "../validators/user";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get(
  "/search",
  [isAuth, ...searchUsersValidators, throwValidationError],
  asyncHandler(searchUsers)
);

export default router;
