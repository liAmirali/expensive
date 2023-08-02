import { Router } from "express";
import { postLogin, postRegister } from "../controller/auth";
import { throwValidationError } from "../validators/utils";
import { loginValidators, registerValidators } from "../validators/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/register", [...registerValidators, throwValidationError], asyncHandler(postRegister));

router.post("/login", [...loginValidators, throwValidationError], asyncHandler(postLogin));

export default router;
