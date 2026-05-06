import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettlementsService } from './settlements.service.js';
import { CreateSettlementDto } from './dto/settlement.dto.js';
import type { Request } from 'express';
import { LedgerAccessGuard } from '../common/guards/ledger-access.guard.js';
import { LedgerParticipantGuard } from '../common/guards/ledger-participant.guard.js';

@ApiBearerAuth()
@ApiTags('Settlements')
@Controller()
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 201 })
  @Post('ledgers/:ledgerId/settlements')
  async createSettlement(
    @Req() req: Request,
    @Param('ledgerId') ledgerId: string,
    @Body() body: CreateSettlementDto,
  ) {
    const userId: ID = (req['user'] as { id: ID }).id;
    return this.settlementsService.create(ledgerId, userId, body);
  }

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 200 })
  @Get('ledgers/:ledgerId/settlements')
  async listSettlements(@Req() req: Request, @Param('ledgerId') ledgerId: string) {
    const userId: ID = (req['user'] as { id: ID }).id;
    return this.settlementsService.list(ledgerId, userId);
  }
}
