import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { ApiRes } from "../utils/responses";
import { User } from "../models/User";

export const searchUsers = async (req: Request, res: Response) => {
  const { q } = matchedData(req, { locations: ["query"] });

  const regex = new RegExp(q, "i");

  const users = await User.find({
    $or: [
      {
        name: { $regex: regex },
      },
      {
        username: { $regex: regex },
      },
    ],
  }).select("-expenses -groups -__v -password");

  return res.json(new ApiRes("Users fetched successfully.", { users: users }));
};
