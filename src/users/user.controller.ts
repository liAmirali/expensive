import { Controller, ForbiddenException, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async me(@Req() req: Request) {
    const userId: number = req['user'].id;
    const foundUser = await this.usersService.findById(userId);
    if (!foundUser) {
      throw new ForbiddenException('User not found.');
    }

    const userResponse = plainToInstance(MeResponseDto, foundUser);

    return userResponse;
  }
}
