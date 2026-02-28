import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Group, Prisma } from '../generated/prisma/client.js';
import { GroupPolicy } from './policies/group-policy.js';

@Injectable()
export class GroupService {
  constructor(private prismaService: PrismaService) {}

  async findOne(groupId: ID) {
    const group = await this.prismaService.group.findUnique({
      where: {
        id: groupId,
        isDeleted: false,
      },
      include: {
        members: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    return group;
  }

  async create(createGroupDto: CreateGroupDto, owner: ID) {
    const { name, description, members } = createGroupDto;

    const existingUserIDs = await this.prismaService.user.findMany({
      where: {
        id: {
          in: members,
        },
      },
    });

    if (existingUserIDs.length !== members.length) {
      throw new BadRequestException("Some users don't exist.");
    }

    const groupMembers: Prisma.GroupMemberCreateManyGroupInput[] = members.map((member) => ({
      userId: member,
      role: 'MEMBER',
    }));
    groupMembers.push({
      userId: owner,
      role: 'OWNER',
    });

    const group = await this.prismaService.group.create({
      data: {
        name,
        description,
        members: {
          create: groupMembers,
        },
      },
      include: {
        members: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    return group;
  }

  async findAllAccessibleGroups(userId: ID) {
    const allGroups = await this.prismaService.group.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
        isDeleted: false,
      },
      include: {
        members: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    return allGroups;
  }

  async update(groupId: ID, updateGroupDto: UpdateGroupDto, who: ID): Promise<Group> {
    const group = await this.findOne(groupId);

    if (!group || !GroupPolicy.canUpdate(who, group)) {
      throw new BadRequestException('You are not allowed to update this group.');
    }

    const { name, description } = updateGroupDto;

    const updatedGroup = await this.prismaService.group.update({
      where: {
        id: groupId,
      },
      data: {
        name,
        description,
      },
      include: {
        members: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    return updatedGroup;
  }

  async delete(groupId: ID, userId: ID) {
    const group = await this.findOne(groupId);

    if (!group || !GroupPolicy.canDelete(userId, group)) {
      throw new BadRequestException('You are not allowed to delete this group.');
    }

    await this.prismaService.group.update({
      data: {
        isDeleted: true,
      },
      where: {
        id: groupId,
      },
    });
  }

  async addMember(groupId: ID, userIdToAdd: ID, whoAdds: ID) {
    const group = await this.findOne(groupId);

    if (!group || !GroupPolicy.canAddMember(whoAdds, group)) {
      throw new BadRequestException('You are not allowed to add a member to this group.');
    }

    const userExists = await this.prismaService.user.findUnique({
      where: {
        id: userIdToAdd,
      },
    });

    if (!userExists) {
      throw new BadRequestException('User does not exist.');
    }

    const userAlreadyInGroup = group.members.find((member) => member.userId === userIdToAdd);

    if (userAlreadyInGroup) {
      throw new BadRequestException('User is already in the group.');
    }

    const newMember = await this.prismaService.groupMember.create({
      data: {
        userId: userIdToAdd,
        groupId,
        role: 'MEMBER',
      },
    });

    return newMember;
  }
}
