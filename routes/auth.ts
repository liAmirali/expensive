import express from "express";
import { postLogin, postRegister } from "../controller/auth";
import { throwValidationError } from "../validators/utils";
import { registerValidators } from "../validators/auth";

const router = express.Router();

router.post("/register", [...registerValidators, throwValidationError], postRegister);

router.post("/login", postLogin);

export default router;
