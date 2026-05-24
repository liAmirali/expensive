import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettlementsService } from './settlements.service.js';
import { CreateSettlementDto } from './dto/settlement.dto.js';
import { LedgerAccessGuard } from '../common/guards/ledger-access.guard.js';
import { LedgerParticipantGuard } from '../common/guards/ledger-participant.guard.js';
import { CurrentUserId } from '../common/decorators/current-user.decorator.js';

@ApiBearerAuth()
@ApiTags('Settlements')
@Controller()
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 201 })
  @Post('ledgers/:ledgerId/settlements')
  async createSettlement(
    @CurrentUserId() userId: ID,
    @Param('ledgerId') ledgerId: string,
    @Body() body: CreateSettlementDto,
  ) {
    return this.settlementsService.create(ledgerId, userId, body);
  }

  @UseGuards(LedgerAccessGuard, LedgerParticipantGuard)
  @ApiResponse({ status: 200 })
  @Get('ledgers/:ledgerId/settlements')
  async listSettlements(@CurrentUserId() userId: ID, @Param('ledgerId') ledgerId: string) {
    return this.settlementsService.list(ledgerId, userId);
  }
}
