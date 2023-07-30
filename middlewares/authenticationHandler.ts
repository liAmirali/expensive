import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
import { IJwtPayload } from "../interfaces/auth";

config();

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.get("Authorization");

  console.log("authorizationHeader :>> ", authorizationHeader);

  if (!authorizationHeader) {
    const error = new ApiError("Authorization header is not provided.");
    error.statusCode = 401;
    throw error;
  }

  const secret = process.env.SECRET;
  if (!secret) {
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
    const payload = jwt.verify(token, secret) as IJwtPayload;
    console.log("JWT payload:", payload);

    req.user = {
      email: payload.email,
      userId: payload.userId,
    };
  } catch (error) {
    console.log("[JWT ERROR]:", error);
    throw error;
  }

  next();
};
