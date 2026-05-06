import { Module } from '@nestjs/common';
import { LedgersController } from './ledgers.controller.js';
import { LedgersService } from './ledgers.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GroupMembershipGuard } from '../common/guards/group-membership.guard.js';
import { LedgerAccessGuard } from '../common/guards/ledger-access.guard.js';

@Module({
  controllers: [LedgersController],
  providers: [LedgersService, PrismaService, GroupMembershipGuard, LedgerAccessGuard],
  exports: [LedgersService],
})
export class LedgersModule {}
