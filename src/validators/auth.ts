import { body, checkExact } from "express-validator";
import { emailValidator } from "./utils";

export const registerValidators = [
  emailValidator(),
  body("password").isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  }),
  body("firstName").notEmpty(),
  body("lastName").optional().notEmpty(),
  checkExact([], { message: "Too many fields specified." }),
];

export const loginValidators = [
  emailValidator(),
  body("password").notEmpty(),
  checkExact([], { message: "Too many fields specified." }),
];
