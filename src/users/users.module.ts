import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.gaurd.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserController } from './user.controller.js';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
