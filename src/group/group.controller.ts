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
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Request } from 'express';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
    const { members } = createGroupDto;
    const owner: ID = req['user'].id;

    if (members && members.includes(owner)) {
      throw new BadRequestException(
        'Owner must not be among the members. It will automatically be added as an owner.',
      );
    }

    return this.groupService.create(createGroupDto, owner);
  }

  // @Get()
  // findAll() {
  //   return this.groupService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
  //   return this.groupService.update(+id, updateGroupDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupService.remove(+id);
  // }
}
