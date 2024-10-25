import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupService {
  constructor(private prismaService: PrismaService) {}

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

    const groupMembers: Prisma.GroupMemberCreateManyGroupInput[] = members.map(
      (member) => ({
        userId: member,
        role: 'MEMBER',
      }),
    );
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
      select: {
        id: true,
        name: true,
        description: true,
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

  async findAll() {
    const allGroups = await this.prismaService.group.findMany();
    console.log('allGroups:', allGroups);
    return allGroups;
  }

  findOne(id: ID) {
    return `This action returns a #${id} group`;
  }

  update(id: ID, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: ID) {
    return `This action removes a #${id} group`;
  }
}
