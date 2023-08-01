import { body, checkExact } from "express-validator";

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
  checkExact([], { message: "Too many fields specified." }),
];

export const deleteGroupValidators = [body("id").isMongoId().withMessage("ID is invalid.")];

export const createOccasionValidators = [
  body("groupId").isMongoId().withMessage("Group ID is invalid."),
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("members")
    .optional()
    .isArray()
    .isMongoId()
    .withMessage("Members field must be an array of member IDs."),
  checkExact([], { message: "Too many fields specified." }),
];
