import {
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MeDTO } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  async me(@Req() req: Request) {
    const userId: number = req['user'].id;
    const foundUser = await this.usersService.findById(userId);
    if (!foundUser) {
      throw new ForbiddenException('User not found.');
    }

    return new MeDTO(foundUser);
  }
}
