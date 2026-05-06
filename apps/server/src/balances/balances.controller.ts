import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BalancesService } from './balances.service.js';
import type { Request } from 'express';
import { LedgerAccessGuard } from '../common/guards/ledger-access.guard.js';
import { LedgerParticipantGuard } from '../common/guards/ledger-participant.guard.js';
import { roundForDisplay } from '../common/utils/decimal.util.js';

@ApiBearerAuth()
@ApiTags('Balances')
@Controller()
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 200 })
  @Get('ledgers/:ledgerId/balances')
  async getBalances(@Req() req: Request, @Param('ledgerId') ledgerId: string) {
    const userId: ID = (req['user'] as { id: ID }).id;
    const { balances, suggestions } = await this.balancesService.getBalances(ledgerId, userId);

    return {
      balances: balances.map((balance) => ({
        userId: balance.userId,
        net: balance.net,
        netDisplay: roundForDisplay(balance.net),
      })),
      suggestions: suggestions.map((suggestion) => ({
        ...suggestion,
        amountDisplay: roundForDisplay(suggestion.amount),
      })),
    };
  }
}
