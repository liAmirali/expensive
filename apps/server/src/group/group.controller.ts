import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupMembershipGuard } from '../common/guards/group-membership.guard.js';
import { GroupRole } from '../generated/prisma/client.js';
import { CurrentUserId } from '../common/decorators/current-user.decorator.js';
import { GroupRoles } from '../common/decorators/group-roles.decorator.js';

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
    @CurrentUserId() owner: ID,
  ): Promise<GroupDTO> {
    const { members } = createGroupDto;

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
  findAll(@CurrentUserId() userId: ID) {
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
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
  @Patch(':groupId')
  async updateGroup(
    @CurrentUserId() userId: ID,
    @Param('groupId') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return new GroupDTO(await this.groupService.update(id, updateGroupDto, userId));
  }

  @ApiOperation({
    description:
      'Deletes a group.\
      Only the owner can delete a group.\
      The group is not actually deleted but marked as deleted.',
  })
  @GroupRoles(GroupRole.OWNER)
  @Delete(':groupId')
  async deleteGroup(@CurrentUserId() userId: ID, @Param('groupId') id: string) {
    return this.groupService.delete(id, userId);
  }

  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
  @Post(':groupId/invite')
  async addMember(
    @CurrentUserId() who: ID,
    @Param('groupId') id: string,
    @Body() body: AddGroupMemberDto,
  ) {
    return this.groupService.addMember(id, body.userId, who, body.role);
  }

  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
  @Delete(':groupId/members/:userId')
  async removeMember(
    @CurrentUserId() who: ID,
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.groupService.removeMember(groupId, userId, who);
  }

  @GroupRoles(GroupRole.OWNER)
  @Patch(':groupId/members/:userId')
  async updateMember(
    @CurrentUserId() who: ID,
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Body() body: UpdateGroupMemberDto,
  ) {
    return this.groupService.updateMember(groupId, userId, body, who);
  }
}
