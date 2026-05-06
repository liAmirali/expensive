import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service.js';
import {
  CreateGroupDto,
  UpdateGroupDto,
  GroupDTO,
  AddGroupMemberDto,
  UpdateGroupMemberDto,
} from './dto/group.dto.js';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupMembershipGuard } from '../common/guards/group-membership.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { GroupRole } from '../generated/prisma/client.js';

@ApiBearerAuth()
@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({
    description:
      'Creates a group.\
      The user is automatically added as an owner.\
      The owner must not be among the members.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 201, type: GroupDTO })
  @Post('')
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: Request,
  ): Promise<GroupDTO> {
    const { members } = createGroupDto;
    const owner: ID = (req['user'] as { id: ID }).id;

    if (members && members.includes(owner)) {
      throw new BadRequestException(
        'Owner must not be among the members. It will automatically be added as an owner.',
      );
    }

    return new GroupDTO(await this.groupService.create(createGroupDto, owner));
  }

  @ApiOperation({
    description:
      'Lists all groups.\
      Only groups that the user is a member of are returned.',
  })
  @ApiResponse({ status: 200, type: GroupDTO, isArray: true })
  @Get('')
  findAll(@Req() req: Request) {
    const userId: ID = (req['user'] as { id: ID }).id;
    return this.groupService.findAllAccessibleGroups(userId).then((groups) =>
      groups.map((group) => new GroupDTO(group as any)),
    );
  }

  @ApiResponse({ status: 200, type: GroupDTO })
  @UseGuards(GroupMembershipGuard)
  @Get(':groupId')
  async findOne(@Param('groupId') groupId: string) {
    const group = await this.groupService.findOne(groupId);
    return new GroupDTO(group as any);
  }

  @ApiOperation({
    description:
      'Partially updates a group.\
      Only the provided fields are updated. The rest remain the same.',
  })
  @ApiResponse({ status: 200, type: GroupDTO })
  @UseGuards(GroupMembershipGuard)
  @Roles(GroupRole.OWNER, GroupRole.ADMIN)
  @Patch(':groupId')
  async updateGroup(
    @Req() req: Request,
    @Param('groupId') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const userId: ID = (req['user'] as { id: ID }).id;
    return new GroupDTO(await this.groupService.update(id, updateGroupDto, userId));
  }

  @ApiOperation({
    description:
      'Deletes a group.\
      Only the owner can delete a group.\
      The group is not actually deleted but marked as deleted.',
  })
  @UseGuards(GroupMembershipGuard)
  @Roles(GroupRole.OWNER)
  @Delete(':groupId')
  async deleteGroup(@Req() req: Request, @Param('groupId') id: string) {
    const userId: ID = (req['user'] as { id: ID }).id;

    return this.groupService.delete(id, userId);
  }

  @UseGuards(GroupMembershipGuard)
  @Roles(GroupRole.OWNER, GroupRole.ADMIN)
  @Post(':groupId/invite')
  async addMember(
    @Req() req: Request,
    @Param('groupId') id: string,
    @Body() body: AddGroupMemberDto,
  ) {
    const who: ID = (req['user'] as { id: ID }).id;
    return this.groupService.addMember(id, body.userId, who, body.role);
  }

  @UseGuards(GroupMembershipGuard)
  @Roles(GroupRole.OWNER)
  @Patch(':groupId/members/:userId')
  async updateMember(
    @Req() req: Request,
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Body() body: UpdateGroupMemberDto,
  ) {
    const who: ID = (req['user'] as { id: ID }).id;
    return this.groupService.updateMember(groupId, userId, body, who);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupService.remove(+id);
  // }
}
