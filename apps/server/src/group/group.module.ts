import { Module } from '@nestjs/common';
import { GroupService } from './group.service.js';
import { GroupController } from './group.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GroupMembershipGuard } from '../common/guards/group-membership.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [GroupController],
  providers: [
    GroupService,
    PrismaService,
    GroupMembershipGuard,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class GroupModule {}
