import { body, checkExact, query } from "express-validator";
import { getEnumValues } from "../utils/getters";
import { ExpenseType } from "../models/Expense";

export const getExpenseValidators = [
  query("minValue")
    .optional()
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Min value cannot be smaller than zero.")
    .toFloat()
    .custom((value, { req }) => {
      if (req.query?.maxValue) return value <= req.query.maxValue;
      return true;
    })
    .withMessage("Min value must be smaller than or equal to max value."),
  query("maxValue")
    .optional()
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Max value cannot be smaller than zero.")
    .toFloat()
    .custom((value, { req }) => {
      if (req.query?.minValue) return value >= req.query.minValue;
      return true;
    })
    .withMessage("Max value must be greater than or equal to minV value."),
  query("description").optional().trim().escape(),
  query("category").optional().trim().escape(),
  query("currency").optional().isCurrency().withMessage("Currency is invalid."),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date is not in ISO 8601 format.")
    .custom((value, { req }) => {
      if (req.query?.endDate) return req.query.endDate >= value;
      return true;
    })
    .withMessage("Start date cannot be after end date."),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date is not in ISO 8601 format.")
    .custom((value, { req }) => {
      if (req.query?.startDate) return req.query.startDate <= value;
      return true;
    })
    .withMessage("End date cannot be before start date."),
  checkExact(),
];

export const addExpenseValidators = [
  body("type")
    .optional()
    .isIn(getEnumValues(ExpenseType))
    .withMessage(
      "Invalid type. Expense type can only be one of " + getEnumValues(ExpenseType) + "."
    ),
  body("value").trim().isFloat({ min: 0 }).toFloat(),
  body("currency").notEmpty(),
  body("title").notEmpty().trim().escape(),
  body("description").optional().trim().escape(),
  body("category").optional().trim().escape(),
  body("dateTime").optional().isISO8601().withMessage("TimeDate is not in ISO 8601 format."),
  checkExact(),
];

export const editExpenseValidators = [
  body("id").notEmpty().isMongoId(),
  body("value").optional().trim().isFloat({ min: 0 }).toFloat(),
  body("description").optional().trim().escape(),
  body("category").optional().trim(),
  body("currency").optional().isCurrency(),
  checkExact(),
];

export const deleteExpenseValidators = [body("id").isMongoId(), checkExact()];
