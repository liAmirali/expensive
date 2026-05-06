import { Module } from '@nestjs/common';
import { SettlementsController } from './settlements.controller.js';
import { SettlementsService } from './settlements.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LedgerAccessGuard } from '../common/guards/ledger-access.guard.js';
import { LedgerParticipantGuard } from '../common/guards/ledger-participant.guard.js';
import { BalancesModule } from '../balances/balances.module.js';

@Module({
  imports: [BalancesModule],
  controllers: [SettlementsController],
  providers: [SettlementsService, PrismaService, LedgerAccessGuard, LedgerParticipantGuard],
})
export class SettlementsModule {}
