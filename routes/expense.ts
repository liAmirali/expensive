import { Router } from "express";
import { addExpense } from "../controller/expense";
import { addExpenseValidators } from "../validators/expense";
import { throwValidationError } from "../validators/utils";
import { isAuth } from "../middlewares/authenticationHandler";

const router = Router();

router.post("/add", [isAuth, ...addExpenseValidators, throwValidationError], addExpense);

export default router;
