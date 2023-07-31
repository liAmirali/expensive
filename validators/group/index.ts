import { body } from "express-validator";

export const createGroupValidators = [
  body("name").notEmpty(),
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
];

export const deleteGroupValidators = [body("id").isMongoId().withMessage("ID is invalid.")];