import { Request, Response } from "express";
import { ApiError, ApiRes } from "../../../utils/responses";
import { matchedData } from "express-validator";
import { Group } from "../../../models/group/Group";
import { Types } from "mongoose";
import { calculateDemandAndDebts } from "../../../utils/expense";

export const getSingleOccasion = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { groupId, occasionId } = matchedData(req, { locations: ["params", "query"] }) as {
    groupId: string;
    occasionId: string;
  };

  const group = await Group.findById(groupId);
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

  const debtsAndDemands = calculateDemandAndDebts(occasion.expenses!);

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

  const newOccasion = {
    name,
    members: membersToAdd,
  };

  group.occasions.push(newOccasion);
  await group.save();

  res.json(new ApiRes("Occasion was created successfully", { occasion: newOccasion }));
};
