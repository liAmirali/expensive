import { Router } from "express";
import { postLogin, postRegister, verifyAccessToken } from "../controller/auth";
import { throwValidationError } from "../validators/utils";
import { loginValidators, registerValidators } from "../validators/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { isAuth } from "../middlewares/authenticationHandler";

const router = Router();

router.post("/register", [...registerValidators, throwValidationError], asyncHandler(postRegister));

router.post("/login", [...loginValidators, throwValidationError], asyncHandler(postLogin));

router.post("/me", [isAuth], asyncHandler(verifyAccessToken))

export default router;
