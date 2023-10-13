import { Request, Response } from "express";
import { IUser, User } from "../../models/User";
import { ApiError, ApiRes } from "../../utils/responses";
import { Group, IGroup } from "../../models/group/Group";
import { Types } from "mongoose";
import { matchedData } from "express-validator";
import { IOccasion } from "../../models/group/Occasion";

export const getSingleGroup = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { groupId } = matchedData(req, { locations: ["params"] }) as { groupId: string };

  const group = await Group.findById(groupId).populate<{ members: IUser[] }>("members");

  if (group === null) {
    return res.json(new ApiError("Group was not found.", 404));
  }

  const userExistingInGroup = group.members.find((u) => u._id.toString() === userId);

  if (!userExistingInGroup) {
    return res.json(new ApiError("You don't have access to this group.", 403));
  }

  for (let member of group.members) {
    member.expenses = undefined;
  }

  group.occasions = group.occasions.filter((occasion) =>
    occasion.members.find((memberObjId) => memberObjId.toString() === userId)
  );

  console.log("group.occasions :>> ", group.occasions);

  return res.json(new ApiRes("Group fetched successfully.", { group }));
};

export const listGroups = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const user = await User.findById(userId)
    .select("groups")
    .populate<{ groups: (IGroup & { members: IUser[] })[] }>("groups")
    .populate({
      path: "groups",
      populate: {
        path: "members",
        model: "User",
      },
    });
  if (user === null) {
    throw new ApiError("User is not authenticated.", 401);
  }

  const { groups } = user;

  groups.forEach((group) => {
    for (let member of group.members as IUser[]) {
      member.expenses = undefined;
    }

    group.occasions = group.occasions.filter((occasion) =>
      occasion.members.find((memberObjId) => memberObjId.toString() === userId)
    );
  });

  if (!groups || groups.length === 0) {
    throw new ApiError("No groups found.", 404);
  }

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
  const { groupId: groupIdToDelete } = req.body;

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

export const updateGroup = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  console.log("userId :>> ", userId);

  const { groupId, name, members } = matchedData(req, { locations: ["params", "body"] }) as {
    groupId: string;
    name?: string;
    members?: string[];
  };

  const group = await Group.findById(groupId);
  if (!group) {
    throw new ApiError("No group was found with this ID", 404);
  }

  if (!group.members.find((id) => id.toString() === userId)) {
    throw new ApiError("You are not authorized.", 403);
  }

  if (members) {
    const removedUsers = group.members
      .filter((memberId) => !members.includes(memberId.toString()))
      .map((objId) => objId.toString());

    if (removedUsers.length > 0) {
      for (const occasion of group.occasions) {
        const occasionMembersToRemove = occasion.members.filter((memberId) =>
          removedUsers.includes(memberId.toString())
        );

        if (occasionMembersToRemove.length > 0) {
          throw new ApiError(
            "You can't remove a user from a group that is a part of an occasion.",
            403
          );
        }
      }
    }

    group.members = members.map((id) => new Types.ObjectId(id));
  }

  if (name) {
    group.name = name;
  }

  await group.save();

  return res.json(new ApiRes("Group was updated successfully."));
};
