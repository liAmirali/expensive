import { query, body, checkExact, param } from "express-validator";

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
  query("groupId").exists().isMongoId().withMessage("Group ID is invalid."),
  checkExact(),
];

export const deleteOccasionValidators = [
  param("occasionId").isMongoId().withMessage("Occasion ID is invalid."),
  body("groupId").exists().isMongoId().withMessage("Group ID is invalid."),
  checkExact(),
];

export const getOccasionMembersValidators = [
  param("occasionId").isMongoId().withMessage("Occasion ID is invalid."),
  query("groupId").exists().isMongoId().withMessage("Group ID is invalid."),
  checkExact(),
];

export const addOccasionMembersValidators = [
  param("occasionId").isMongoId().withMessage("Occasion ID is invalid."),
  body("groupId").exists().isMongoId().withMessage("Group ID is invalid."),
  body("userIds").exists().isArray().isMongoId().withMessage("User ID is invalid."),
  checkExact(),
];

