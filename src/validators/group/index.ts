import { body, checkExact, param, query } from "express-validator";

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
  param("groupId").isMongoId().withMessage("Group ID is invalid."),
  checkExact(),
];

export const updateGroupValidators = [
  param("groupId").isMongoId().withMessage("Group ID is invalid."),
  body("name").optional(),
  body("members").optional().isMongoId().isArray(),
  checkExact(),
];

export const getGroupListValidators = [checkExact()];

export const getSingleGroupValidators = [
  param("groupId").isMongoId().withMessage("Group ID is invalid."),
  checkExact(),
];
