import { query, body, checkExact, param } from "express-validator";
import { isAcceptedCurrency } from "../utils";

export const createOccasionValidators = [
  body("groupId")
    .exists()
    .withMessage("Field is required.")
    .isMongoId()
    .withMessage("Group ID is invalid."),
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("members")
    .optional()
    .isArray()
    .isMongoId()
    .withMessage("Members field must be an array of member IDs."),
  checkExact(),
];

export const getSingleOccasionValidators = [
  param("occasionId").isMongoId().withMessage("Occasion ID is invalid."),
  query("groupId").isMongoId().withMessage("Group ID is invalid."),
  checkExact(),
];

export const createOccasionExpenseValidators = [
  body("groupId").exists().withMessage("Field is required.").isMongoId(),
  body("occasionId").exists().withMessage("Field is required.").isMongoId(),
  body("value")
    .exists()
    .withMessage("Field is required.")
    .isFloat({ min: 0 })
    .withMessage("Value must be a non-negative float."),
  body("category").notEmpty(),
  body("title").notEmpty().trim().escape(),
  body("description").optional().notEmpty().escape(),
  body("currency").custom(isAcceptedCurrency).withMessage("Currency is invalid."),
  body("paidBy").isMongoId().withMessage("User ID is invalid."),
  body("assignedTo").isArray().isMongoId().withMessage("Field must be an array of user IDs."),
  checkExact(),
];

export const getOccasionExpensesValidators = [
  query("groupId")
    .exists()
    .withMessage("Field is required.")
    .isMongoId()
    .withMessage("Group ID is invalid."),
  query("occasionId").exists().withMessage("Field is required.").isMongoId(),
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
  query("paidBy").optional().isMongoId().withMessage("User ID is invalid."),
  query("assignedTo")
    .optional()
    .isMongoId()
    .toArray()
    .withMessage("This field must be an array of user IDs."),
  checkExact(),
];
