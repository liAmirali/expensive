import {
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import type { Request } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeDTO, UserPublicDTO } from './dto/user.dto.js';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, type: MeDTO })
  @Get('me')
  async me(@Req() req: Request) {
    const userId: ID = (req['user'] as { id: ID }).id;
    const foundUser = await this.usersService.findById(userId);
    if (!foundUser) {
      throw new ForbiddenException('User not found.');
    }

    return new MeDTO(foundUser);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, type: UserPublicDTO, isArray: true })
  @Get('search')
  async search(@Query('q') query: string) {
    return (await this.usersService.search(query)).map(
      (user) => new UserPublicDTO(user),
    );
  }
}
