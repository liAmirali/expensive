import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/errors";

export const throwValidationError = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);

  console.log("RESULT:", result);

  if (!result.isEmpty()) {
    throw new ApiError("Validation Error.", 422, result.array());
  }

  next();
};

export const emailValidator = () => body("email").notEmpty().isEmail().normalizeEmail();