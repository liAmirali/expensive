import { Request, Response } from "express";
import { ApiError, ApiRes } from "../../../utils/responses";
import { matchedData } from "express-validator";
import { Group } from "../../../models/group/Group";
import { Types } from "mongoose";
import { calculateDemandAndDebts } from "../../../utils/expense";
import { IUser, User } from "../../../models/User";
import { IOccasion } from "../../../models/group/Occasion";

export const getSingleOccasion = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { groupId, occasionId } = matchedData(req, { locations: ["params", "query"] }) as {
    groupId: string;
    occasionId: string;
  };

  const group = await Group.findById(groupId)
    .populate<{ occasions: (IOccasion & { expenses: IOccasionExpense[] })[] }>("occasions.expenses")
    .lean();
  if (!group) {
    throw new ApiError("Group was not found.", 404);
  }

  const occasion = group.occasions.find((occasion) => occasion._id!.toString() === occasionId);
  if (!occasion) {
    throw new ApiError("Occasion was not found.", 404);
  }

  const userFound = occasion.members.find((objId) => objId.toString() === userId);
  if (!userFound) {
    throw new ApiError("You are not part of this occasion.", 403);
  }

  const [expenses, debtsAndDemands] = calculateDemandAndDebts(occasion.expenses!, userId);
  // occasion.expenses = expenses;

  return res.json(
    new ApiRes("Occasion details was sent successfully.", { occasion, debtsAndDemands })
  );
};

export const createOccasion = async (req: Request, res: Response) => {
  const { name, members, groupId } = matchedData(req) as {
    name: string;
    members?: string[];
    groupId: string;
  };

  const userId = req.user!.userId;

  const group = await Group.findById(groupId);
  if (group === null) {
    throw new ApiError("Group ID was not found.", 404);
  }

  // Checking if the user is among the group members
  const groupMemberIds = group.members.map((objId) => objId.toString());
  const userFound = groupMemberIds.includes(userId);
  if (!userFound) {
    throw new ApiError("User is not authorized.", 401);
  }

  if (members) {
    if (members.includes(userId)) {
      throw new ApiError(
        "The creator must not be inside the member array. It will be added automatically.",
        422
      );
    }

    // Checking if all the occasion members exist in the group members
    members.forEach((id) => {
      if (!groupMemberIds.includes(id)) {
        throw new ApiError("Some occasion members don't exist in the group.", 402);
      }
    });
  }

  let membersToAdd = members ? members.map((id) => new Types.ObjectId(id)) : [];
  membersToAdd.push(new Types.ObjectId(userId));

  const newOccasion: IOccasion = {
    _id: new Types.ObjectId(),
    name,
    members: membersToAdd,
    expenses: [],
  };

  group.occasions.push(newOccasion);
  await group.save();

  res.json(new ApiRes("Occasion was created successfully", { occasion: newOccasion }));
};

export const deleteOccasion = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { occasionId, groupId } = matchedData(req, { locations: ["params", "body"] }) as {
    occasionId: string;
    groupId: string;
  };

  const group = await Group.findById(groupId).populate<{ occasions: IOccasion[] }>("occasions");
  if (!group) {
    throw new ApiError("Group was not found.", 404);
  }

  const occasion = group.occasions.find((occasion) => occasion._id!.toString() === occasionId);
  if (!occasion) {
    throw new ApiError("Occasion was not found.", 404);
  }

  if (!occasion.members.find((member) => member._id.toString() === userId)) {
    throw new ApiError("You are not authorized", 403);
  }

  await group.updateOne({
    $pull: {
      occasions: {
        _id: occasionId,
      },
    },
  });

  return res.json(new ApiRes("Occasion was deleted successfully."));
};

export const getOccasionMembers = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { occasionId, groupId } = matchedData(req, { locations: ["params", "query"] });

  console.log("occasionId :>> ", occasionId);
  console.log("groupId :>> ", groupId);

  const group = await Group.findById(groupId)
    .populate<{ occasions: (IOccasion & { members: IUser[] })[] }>({
      path: "occasions",
      populate: {
        path: "members",
        model: "User",
      },
    })
    .lean();

  if (!group) {
    throw new ApiError("Group was not found.", 404);
  }
  console.log("group.occasions :>> ", group.occasions);

  const occasion = group.occasions.find((occasion) => occasion._id!.toString() === occasionId);
  if (!occasion) {
    throw new ApiError("Occasion was not found.", 404);
  }

  let userIsInOccasion = false;
  for (const member of occasion.members) {
    if (member._id.toString() === userId) userIsInOccasion = true;
    member.expenses = undefined;
  }
  if (!userIsInOccasion) {
    throw new ApiError("Not authorized.", 403);
  }

  return res.json(
    new ApiRes("Occasion members was sent successfully.", { members: occasion.members })
  );
};

export const addOccasionMembers = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { occasionId, groupId, userIds } = matchedData(req, { locations: ["params", "body"] }) as {
    occasionId: string;
    groupId: string;
    userIds: string[];
  };

  const existingUserCount = await User.count({ _id: { $in: userIds } });
  if (existingUserCount !== userIds.length) {
    throw new ApiError("Some user IDs doesn't exist.", 404);
  }

  const group = await Group.findById(groupId).populate<{ occasions: IOccasion[] }>("occasions");
  if (!group) {
    throw new ApiError("Group was not found.", 404);
  }

  const occasion = group.occasions.find((occasion) => occasion._id!.toString() === occasionId);
  if (!occasion) {
    throw new ApiError("Occasion was not found.", 404);
  }

  if (!occasion.members.find((member) => member._id.toString() === userId)) {
    throw new ApiError("You are not authorized", 403);
  }

  const result = await Group.updateOne(
    { _id: groupId, "occasions._id": occasionId },
    { $set: { "occasions.$.members": userIds } }
  );

  return res.json(new ApiRes("Occasion was updated successfully."));
};
