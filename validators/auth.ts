import { body } from "express-validator";
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
];
