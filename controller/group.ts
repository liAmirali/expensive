import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/errors";
import { Group } from "../models/Group";
import { ObjectId } from "mongodb";

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, members } = req.body as { name: string; members: string[] }; // TODO: Define interface

  if (members) {
    const fetchedMembers = await User.find({ _id: { $in: { members } } });

    console.log("MEMBERS: ", members);
    console.log("fetchedMembers:", fetchedMembers);

    // Throwing an error if some users in the members array was not found in the database
    if (fetchedMembers === null || fetchedMembers.length < members.length) {
      const error = new ApiError("Some users didn't exist in the database.", 422);
      const fetchedIds = fetchedMembers.map((member) => member._id.toString());
      error.data = members.filter((item) => !fetchedIds.includes(item));
      return next(error);
    }
  }

  const userId = req.user!.userId;
  const creatorUser = await User.exists({ _id: new ObjectId(userId) });
  if (creatorUser === null) {
    throw new ApiError("Creator was not authenticated.", 401);
  }

  const newGroup = new Group({ name: name, creator: creatorUser._id });
  await newGroup.save();

  return res.json({ message: "Group was created successfully." });
};
