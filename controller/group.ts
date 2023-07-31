import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/errors";
import { Group } from "../models/Group";
import { Types } from "mongoose";

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, members } = req.body as { name?: string; members?: string[] }; // TODO: Define interface

  const memberObjectIds = members && members.map((id) => new Types.ObjectId(id));

  const userId = req.user!.userId;
  const creatorUser = await User.exists({ _id: new Types.ObjectId(userId) });

  if (creatorUser === null) {
    throw new ApiError("Creator was not authenticated.", 401);
  }

  const newGroup = new Group({ name: name, creator: creatorUser._id });

  if (memberObjectIds) {
    const fetchedMembers = await User.find({ _id: { $in: memberObjectIds } });
    console.log("fetchedMembers:", fetchedMembers);

    // Throwing an error if some users in the members array was not found in the database
    if (fetchedMembers === null || fetchedMembers.length < members.length) {
      const error = new ApiError("Some users didn't exist in the database.", 422);
      const fetchedIds = fetchedMembers.map((member) => member._id.toString());
      error.data = members.filter((item) => !fetchedIds.includes(item));
      throw error;
    }

    // Adding the group to each of the members groups
    await User.updateMany({ _id: { $in: memberObjectIds } }, { $push: { groups: newGroup._id } });
    // Adding the group to the creator groups
    await User.findByIdAndUpdate(userId, { $push: { groups: newGroup._id } });

    // Adding the users to the group
    newGroup.members = memberObjectIds;
    newGroup.members.push(creatorUser._id);
  }

  await newGroup.save();

  return res.json({ message: "Group was created successfully." });
};
