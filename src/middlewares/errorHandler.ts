import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/responses";

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  return res
    .status(error.statusCode || 500)
    .json({ message: error.message, data: error.data, statusCode: error.statusCode });
};
