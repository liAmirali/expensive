import { Module } from '@nestjs/common';
import { GroupService } from './group.service.js';
import { GroupController } from './group.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  controllers: [GroupController],
  providers: [GroupService, PrismaService],
})
export class GroupModule {}
