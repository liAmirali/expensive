import { Request, Response } from "express";
import { User } from "../../../models/User";
import { ApiError } from "../../../utils/errors";
import { matchedData } from "express-validator";

export const createOccasion = async (req: Request, res: Response) => {
  const { name, members, groupId } = matchedData(req);

  const userId = req.user!.userId;

  const occasionCreator = await User.exists({
    _id: userId,
    groups: {
      $in: groupId,
    },
  });

  if (occasionCreator === null) {
    throw new ApiError("Creator is not authorized.", 401);
  }

  console.log("occasionCreator :>> ", occasionCreator);

  res.json({ message: "Occasion was created successfully" });
};
