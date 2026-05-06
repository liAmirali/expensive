import { Module } from '@nestjs/common';
import { BalancesController } from './balances.controller.js';
import { BalancesService } from './balances.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LedgerAccessGuard } from '../common/guards/ledger-access.guard.js';
import { LedgerParticipantGuard } from '../common/guards/ledger-participant.guard.js';

@Module({
  controllers: [BalancesController],
  providers: [BalancesService, PrismaService, LedgerAccessGuard, LedgerParticipantGuard],
  exports: [BalancesService],
})
export class BalancesModule {}
