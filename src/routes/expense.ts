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
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", [isAuth, ...getExpenseValidators, throwValidationError], asyncHandler(getExpense));
router.post("/", [isAuth, ...addExpenseValidators, throwValidationError], asyncHandler(addExpense));
router.put("/", [isAuth, ...editExpenseValidators, throwValidationError], asyncHandler(editExpense));
router.delete("/", [isAuth, ...deleteExpenseValidators, throwValidationError], asyncHandler(deleteExpense));

export default router;
