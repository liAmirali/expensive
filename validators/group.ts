import { body } from "express-validator";

export const createGroupValidators = [
  body("name").notEmpty(),
  body("members")
    .optional()
    .isArray()
    .isMongoId()
    .custom((value) => {
      if (!value) return true;

      const removedDuplicates = Array.from(new Set(value));
      return value.length === removedDuplicates.length;
    }),
];
