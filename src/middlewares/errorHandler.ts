import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errors";

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[ERROR]: ", error);

  return res
    .status(error.statusCode || 500)
    .json({ message: error.message, data: error.data, statusCode: error.statusCode });
};
