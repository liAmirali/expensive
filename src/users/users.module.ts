import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.gaurd';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
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
