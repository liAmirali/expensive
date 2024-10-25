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
import { CreateGroupDto, UpdateGroupDto, GroupDTO } from './dto/group.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 201, type: GroupDTO })
  @Post('create')
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

  @Get('all')
  findAll() {
    return this.groupService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, updateGroupDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupService.remove(+id);
  // }
}
