import { checkExact, query } from "express-validator";

export const searchUsersValidators = [
  query("q").trim().notEmpty().isLength({ min: 3 }),
  checkExact(),
];
