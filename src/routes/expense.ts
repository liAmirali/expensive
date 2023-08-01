import { Router } from "express";
import { addExpense, deleteExpense, editExpense, getExpense } from "../controller/expense";
import {
  addExpenseValidators,
  deleteExpenseValidators,
  editExpenseValidators,
  getExpenseValidators,
} from "../validators/expense";
import { throwValidationError } from "../validators/utils";
import { isAuth } from "../middlewares/authenticationHandler";

const router = Router();

router.get("/", [isAuth, ...getExpenseValidators, throwValidationError], getExpense);
router.post("/", [isAuth, ...addExpenseValidators, throwValidationError], addExpense);
router.put("/", [isAuth, ...editExpenseValidators, throwValidationError], editExpense);
router.delete("/", [isAuth, ...deleteExpenseValidators, throwValidationError], deleteExpense);

export default router;
