import { Router } from "express";
import { postLogin, postRegister } from "../controller/auth";
import { throwValidationError } from "../validators/utils";
import { loginValidators, registerValidators } from "../validators/auth";

const router = Router();

router.post("/register", [...registerValidators, throwValidationError], postRegister);

router.post("/login", [...loginValidators, throwValidationError], postLogin);

export default router;
