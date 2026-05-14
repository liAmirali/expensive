import {
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Query,
  Req,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import type { Request } from 'express';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeDTO, UpdateMeDto, UserPublicDTO } from './dto/user.dto.js';

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
  @ApiResponse({ status: 200, type: MeDTO })
  @Patch('me')
  async updateMe(@Req() req: Request, @Body() body: UpdateMeDto) {
    const userId: ID = (req['user'] as { id: ID }).id;
    const updatedUser = await this.usersService.updateMe(userId, body);
    return new MeDTO(updatedUser);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, type: UserPublicDTO, isArray: true })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'includeSelf', required: false, type: Boolean })
  @Get('search')
  async search(
    @Req() req: Request,
    @Query('q') query: string,
    @Query('includeSelf') includeSelf?: string,
  ) {
    const userId: ID = (req['user'] as { id: ID }).id;
    const exclude = includeSelf === 'true' ? undefined : userId;
    return (await this.usersService.search(query, exclude)).map(
      (user) => new UserPublicDTO(user),
    );
  }
}
