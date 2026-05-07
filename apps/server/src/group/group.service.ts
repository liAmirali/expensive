import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto, UpdateGroupDto, UpdateGroupMemberDto } from './dto/group.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Group, GroupMembershipStatus, GroupRole, Prisma } from '../generated/prisma/client.js';

@Injectable()
export class GroupService {
  constructor(private prismaService: PrismaService) {}

  async findOne(groupId: ID) {
    const group = await this.prismaService.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        memberships: {
          select: {
            userId: true,
            role: true,
            status: true,
          },
        },
      },
    });

    return group;
  }

  async create(createGroupDto: CreateGroupDto, owner: ID) {
    const { name, description, members = [] } = createGroupDto;

    if (members.length > 0) {
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
    }

    const groupMembers: Prisma.GroupMembershipCreateManyGroupInput[] = members.map((member) => ({
      userId: member,
      role: GroupRole.MEMBER,
      status: GroupMembershipStatus.PENDING,
    }));
    groupMembers.push({
      userId: owner,
      role: GroupRole.OWNER,
      status: GroupMembershipStatus.ACTIVE,
    });

    const group = await this.prismaService.group.create({
      data: {
        name,
        description,
        createdById: owner,
        memberships: {
          createMany: { data: groupMembers },
        },
      },
      include: {
        memberships: {
          select: {
            userId: true,
            role: true,
            status: true,
          },
        },
      },
    });

    return group;
  }

  async findAllAccessibleGroups(userId: ID) {
    const allGroups = await this.prismaService.group.findMany({
      where: {
        memberships: {
          some: {
            userId,
            status: GroupMembershipStatus.ACTIVE,
          },
        },
      },
      include: {
        memberships: {
          select: {
            userId: true,
            role: true,
            status: true,
          },
        },
      },
    });

    return allGroups;
  }

  async update(groupId: ID, updateGroupDto: UpdateGroupDto, who: ID): Promise<Group> {
    const group = await this.findOne(groupId);

    if (!group) {
      throw new NotFoundException('Group not found.');
    }

    const membership = await this.prismaService.groupMembership.findFirst({
      where: { groupId, userId: who, status: GroupMembershipStatus.ACTIVE },
    });

    if (!membership || (membership.role !== GroupRole.OWNER && membership.role !== GroupRole.ADMIN)) {
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
        memberships: {
          select: {
            userId: true,
            role: true,
            status: true,
          },
        },
      },
    });

    return updatedGroup;
  }

  async delete(groupId: ID, userId: ID) {
    const membership = await this.prismaService.groupMembership.findFirst({
      where: {
        groupId,
        userId,
        status: GroupMembershipStatus.ACTIVE,
        role: GroupRole.OWNER,
      },
    });

    if (!membership) {
      throw new BadRequestException('You are not allowed to archive this group.');
    }

    await this.prismaService.group.update({
      data: {
        archivedAt: new Date(),
      },
      where: {
        id: groupId,
      },
    });
  }

  async addMember(groupId: ID, userIdToAdd: ID, whoAdds: ID, role: GroupRole = GroupRole.MEMBER) {
    const inviter = await this.prismaService.groupMembership.findFirst({
      where: { groupId, userId: whoAdds, status: GroupMembershipStatus.ACTIVE },
    });

    if (!inviter || (inviter.role !== GroupRole.OWNER && inviter.role !== GroupRole.ADMIN)) {
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

    const existingMembership = await this.prismaService.groupMembership.findUnique({
      where: { groupId_userId: { groupId, userId: userIdToAdd } },
    });

    if (existingMembership) {
      throw new BadRequestException('User is already in the group.');
    }

    const newMember = await this.prismaService.groupMembership.create({
      data: {
        userId: userIdToAdd,
        groupId,
        role,
        status: GroupMembershipStatus.PENDING,
        invitedById: whoAdds,
      },
    });

    return newMember;
  }

  async updateMember(groupId: ID, memberId: ID, data: UpdateGroupMemberDto, who: ID) {
    const updater = await this.prismaService.groupMembership.findFirst({
      where: { groupId, userId: who, status: GroupMembershipStatus.ACTIVE },
    });

    if (!updater || updater.role !== GroupRole.OWNER) {
      throw new BadRequestException('Only the owner can update member roles.');
    }

    const target = await this.prismaService.groupMembership.findUnique({
      where: { groupId_userId: { groupId, userId: memberId } },
    });

    if (!target) {
      throw new NotFoundException('Group member not found.');
    }

    if (target.role === GroupRole.OWNER) {
      throw new BadRequestException('Owner role cannot be modified.');
    }

    if (data.role === GroupRole.OWNER) {
      throw new BadRequestException('Owner role cannot be reassigned.');
    }

    return this.prismaService.groupMembership.update({
      where: { groupId_userId: { groupId, userId: memberId } },
      data: {
        role: data.role,
        status: data.status,
      },
    });
  }
}
