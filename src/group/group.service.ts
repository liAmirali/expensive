import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupMember, Prisma } from '@prisma/client';

@Injectable()
export class GroupService {
  constructor(private prismaService: PrismaService) {}

  async create(createGroupDto: CreateGroupDto, owner: ID) {
    const { name, description, members } = createGroupDto;

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
    });

    return group;
  }

  async findAll() {
    const allGroups = await this.prismaService.group.findMany();
    console.log('allGroups:', allGroups);
    return allGroups;
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
