import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/responses";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../interfaces/auth";
import { DB_SECRET } from "../constants/database";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.get("Authorization");

  console.log("authorizationHeader :>> ", authorizationHeader);

  if (!authorizationHeader) {
    const error = new ApiError("Authorization header is not provided.");
    error.statusCode = 401;
    throw error;
  }

  if (!DB_SECRET) {
    const error = new ApiError("Internal error.");
    error.statusCode = 500;
    throw error;
  }

  const token = authorizationHeader.split("Bearer ")[1];
  if (!token) {
    const error = new ApiError("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  try {
    console.log("READ TOKEN:", token);
    const payload = jwt.verify(token, DB_SECRET) as IJwtPayload;
    console.log("JWT payload:", payload);

    req.user = {
      email: payload.email,
      userId: payload.userId,
    };
  } catch (error) {
    console.log("[JWT ERROR]:", error);
    throw new ApiError("Invalid token.", 401);
  }

  next();
};
