import { body, checkExact } from "express-validator";
import { emailValidator } from "./utils";

export const registerValidators = [
  emailValidator(),
  body("username").trim().notEmpty(),
  body("name").trim(),
  body("password").isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  }),
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

export const emailVerificationValidators = [body("verifyEmailToken").exists(), checkExact()];
