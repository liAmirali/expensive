import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller.js';
import { ExpensesService } from './expenses.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LedgerAccessGuard } from '../common/guards/ledger-access.guard.js';
import { LedgerParticipantGuard } from '../common/guards/ledger-participant.guard.js';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService, PrismaService, LedgerAccessGuard, LedgerParticipantGuard],
  exports: [ExpensesService],
})
export class ExpensesModule {}
