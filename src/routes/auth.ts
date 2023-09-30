import { Router } from "express";
import {
  postLogin,
  postRegister,
  resetPassword,
  resetPasswordRequest,
  verifyAccessToken,
} from "../controller/auth";
import { throwValidationError } from "../validators/utils";
import { loginValidators, registerValidators, resetPasswordValidators } from "../validators/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { isAuth } from "../middlewares/authenticationHandler";

const router = Router();

router.post("/register", [...registerValidators, throwValidationError], asyncHandler(postRegister));

router.post("/login", [...loginValidators, throwValidationError], asyncHandler(postLogin));

router.post("/me", [isAuth], asyncHandler(verifyAccessToken));

router.get("/reset-pass", [isAuth], asyncHandler(resetPasswordRequest));

router.post(
  "/reset-pass",
  [isAuth, ...resetPasswordValidators, throwValidationError],
  asyncHandler(resetPassword)
);

export default router;
