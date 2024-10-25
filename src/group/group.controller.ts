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
  ParseIntPipe,
} from '@nestjs/common';
import { GroupService } from './group.service';
import {
  CreateGroupDto,
  UpdateGroupDto,
  GroupDTO,
  AddGroupMemberDto,
} from './dto/group.dto';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: Request,
  ): Promise<GroupDTO> {
    const { members } = createGroupDto;
    const owner: ID = req['user'].id;

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
    const userId: ID = req['user'].id;
    return this.groupService.findAllAccessibleGroups(userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupService.findOne(+id);
  // }

  @ApiOperation({
    description:
      'Partially updates a group.\
      Only the provided fields are updated. The rest remain the same.',
  })
  @ApiResponse({ status: 200, type: GroupDTO })
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const userId: ID = req['user'].id;
    return new GroupDTO(
      await this.groupService.update(id, updateGroupDto, userId),
    );
  }

  @Post(':id/members')
  async addMember(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddGroupMemberDto,
  ) {
    const who: ID = req['user'].id;
    return this.groupService.addMember(id, body.userId, who);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupService.remove(+id);
  // }
}
