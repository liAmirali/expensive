import { Router } from "express";
import {
  postLogin,
  postRegister,
  resetPassword,
  requestResetPassword,
  verifyAccessToken,
  requestEmailVerification,
  verifyEmail,
} from "../controller/auth";
import { throwValidationError } from "../validators/utils";
import {
  emailVerificationValidators,
  loginValidators,
  registerValidators,
  resetPasswordValidators,
} from "../validators/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { isAuth } from "../middlewares/authenticationHandler";

const router = Router();

router.post("/register", [...registerValidators, throwValidationError], asyncHandler(postRegister));

router.post("/login", [...loginValidators, throwValidationError], asyncHandler(postLogin));

router.post("/me", [isAuth], asyncHandler(verifyAccessToken));

router.get("/reset-pass", [isAuth], asyncHandler(requestResetPassword));

router.post(
  "/reset-pass",
  [isAuth, ...resetPasswordValidators, throwValidationError],
  asyncHandler(resetPassword)
);

router.get("/verify-email", [isAuth], asyncHandler(requestEmailVerification));
router.post(
  "/verify-email",
  [isAuth, ...emailVerificationValidators, throwValidationError],
  asyncHandler(verifyEmail)
);

export default router;
