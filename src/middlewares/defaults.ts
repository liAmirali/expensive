import { NextFunction, Request, Response } from "express";

export const defaults = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-store");
  next();
}