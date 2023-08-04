import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/responses";

export const throwValidationError = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);

  console.log("RESULT:", result);

  if (!result.isEmpty()) {
    throw new ApiError("Validation Error.", 422, result.array());
  }

  next();
};

/**
 * Checks the "email" field in request body
 */
export const emailValidator = () => body("email").notEmpty().normalizeEmail().isEmail();
