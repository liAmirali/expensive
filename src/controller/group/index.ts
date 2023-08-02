import { Request, Response } from "express";
import { User } from "../../models/User";
import { ApiError, ApiRes } from "../../utils/responses";
import { Group } from "../../models/group/Group";
import { Types } from "mongoose";
import { matchedData } from "express-validator";

export const listGroups = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const user = await User.findById(userId).populate("groups");
  if (user === null) {
    throw new ApiError("User is not authenticated.", 401);
  }

  const { groups } = user;

  if (!groups || groups.length === 0) {
    throw new ApiError("No groups found.", 404);
  }

  console.log("user's groups :>> ", groups);

  return res.json(new ApiRes("Groups fetched successfully.", { groups }));
};

export const createGroup = async (req: Request, res: Response) => {
  const { name, members } = matchedData(req) as { name?: string; members?: string[] }; // TODO: Define interface

  const memberObjectIds = members && members.map((id) => new Types.ObjectId(id));

  const userId = req.user!.userId;
  const creatorUser = await User.exists({ _id: new Types.ObjectId(userId) });

  if (creatorUser === null) {
    throw new ApiError("Creator was not authenticated.", 401);
  }

  const newGroup = new Group({ name: name, creator: creatorUser._id });

  if (memberObjectIds) {
    if (members.includes(userId)) {
      throw new ApiError(
        "Creator must not be passed to the group members. It will be added automatically.",
        422
      );
    }

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
    // Adding the users to the group
    newGroup.members = memberObjectIds;
  }

  // Adding the group to the creator groups
  await User.findByIdAndUpdate(userId, { $push: { groups: newGroup._id } });
  // Adding the creator to the members
  newGroup.members.push(creatorUser._id);

  await newGroup.save();

  return res.json(new ApiRes("Group was created successfully.", { group: newGroup }));
};

export const deleteGroup = async (req: Request, res: Response) => {
  // TODO: add authorization, only authorized people should be able to delete a group
  const { id: groupIdToDelete } = req.body;

  // Removing the group
  const group = await Group.findByIdAndDelete(groupIdToDelete);

  if (group === null) {
    throw new ApiError("Group was not found.", 404);
  }

  // Removing the group from its members groups list
  await User.updateMany(
    { groups: { $in: [groupIdToDelete] } },
    {
      $pull: {
        groups: groupIdToDelete,
      },
    }
  );

  return res.send(new ApiRes("Group was deleted successfully."));
};
