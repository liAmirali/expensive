import { body, checkExact, query } from "express-validator";

export const createGroupValidators = [
  body("name").notEmpty().withMessage("Group name must be specified."),
  body("members")
    .optional()
    .isArray()
    .withMessage("Members property must be an array of IDs.")
    .isMongoId()
    .withMessage("IDs are invalid.")
    .custom((value) => {
      if (!value) return true;

      const removedDuplicates = Array.from(new Set(value));
      return value.length === removedDuplicates.length;
    })
    .withMessage("Members field contains duplicate IDs."),
  checkExact(),
];

export const deleteGroupValidators = [
  body("id").isMongoId().withMessage("ID is invalid."),
  checkExact(),
];

export const getGroupListValidators = [
  query("id").optional().isMongoId().withMessage("Group ID is invalid."),
  checkExact(),
];
