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
  checkExact(),
];

export const loginValidators = [emailValidator(), body("password").notEmpty(), checkExact()];

export const resetPasswordValidators = [
  body("newPassword").isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  }),
  body("resetToken").exists(),
  checkExact(),
];
