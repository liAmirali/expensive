import { body } from "express-validator";

export const addExpenseValidators = [
  body("value").trim().isFloat({ min: 0 }).toFloat(),
  body("description").optional().trim().escape(),
  body("category").optional().trim(),
  body("currency").optional().isCurrency(),
];

export const editExpenseValidators = [
  body("id").notEmpty().isMongoId(),
  body("value").optional().trim().isFloat({ min: 0 }).toFloat(),
  body("description").optional().trim().escape(),
  body("category").optional().trim(),
  body("currency").optional().isCurrency(),
];

export const deleteExpenseValidators = [body("id").isMongoId()];
