import {
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeDTO, UpdateMeDto, UserPublicDTO } from './dto/user.dto.js';
import { CurrentUserId } from '../common/decorators/current-user.decorator.js';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, type: MeDTO })
  @Get('me')
  async me(@CurrentUserId() userId: ID) {
    const foundUser = await this.usersService.findById(userId);
    if (!foundUser) {
      throw new ForbiddenException('User not found.');
    }

    return new MeDTO(foundUser);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, type: MeDTO })
  @Patch('me')
  async updateMe(@CurrentUserId() userId: ID, @Body() body: UpdateMeDto) {
    const updatedUser = await this.usersService.updateMe(userId, body);
    return new MeDTO(updatedUser);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, type: UserPublicDTO, isArray: true })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'includeSelf', required: false, type: Boolean })
  @Get('search')
  async search(
    @CurrentUserId() userId: ID,
    @Query('q') query: string,
    @Query('includeSelf') includeSelf?: string,
  ) {
    const exclude = includeSelf === 'true' ? undefined : userId;
    return (await this.usersService.search(query, exclude)).map(
      (user) => new UserPublicDTO(user),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, type: UserPublicDTO })
  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return new UserPublicDTO(user);
  }
}
