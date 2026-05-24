import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LedgersService } from './ledgers.service.js';
import { AddLedgerParticipantDto, CreateLedgerDto, LedgerDto, UpdateLedgerDto } from './dto/ledger.dto.js';
import { GroupMembershipGuard } from '../common/guards/group-membership.guard.js';
import { LedgerAccessGuard } from '../common/guards/ledger-access.guard.js';
import { CurrentUserId } from '../common/decorators/current-user.decorator.js';

@ApiBearerAuth()
@ApiTags('Ledgers')
@Controller()
export class LedgersController {
  constructor(private readonly ledgersService: LedgersService) {}

  @UseGuards(GroupMembershipGuard)
  @ApiResponse({ status: 201, type: LedgerDto })
  @Post('groups/:groupId/ledgers')
  async createLedger(
    @CurrentUserId() userId: ID,
    @Param('groupId') groupId: string,
    @Body() body: CreateLedgerDto,
  ) {
    const ledger = await this.ledgersService.create(groupId, userId, body);
    return new LedgerDto(ledger);
  }

  @UseGuards(GroupMembershipGuard)
  @ApiResponse({ status: 200, type: LedgerDto, isArray: true })
  @Get('groups/:groupId/ledgers')
  async listLedgers(@CurrentUserId() userId: ID, @Param('groupId') groupId: string) {
    const ledgers = await this.ledgersService.listByGroup(groupId, userId);
    return ledgers.map((ledger) => new LedgerDto(ledger));
  }

  @UseGuards(LedgerAccessGuard)
  @ApiResponse({ status: 200, type: LedgerDto })
  @Get('ledgers/:ledgerId')
  async getLedger(@CurrentUserId() userId: ID, @Param('ledgerId') ledgerId: string) {
    const ledger = await this.ledgersService.findById(ledgerId, userId);
    return new LedgerDto(ledger);
  }

  @UseGuards(LedgerAccessGuard)
  @ApiResponse({ status: 200, type: LedgerDto })
  @Patch('ledgers/:ledgerId')
  async updateLedger(
    @CurrentUserId() userId: ID,
    @Param('ledgerId') ledgerId: string,
    @Body() body: UpdateLedgerDto,
  ) {
    const ledger = await this.ledgersService.update(ledgerId, userId, body);
    return new LedgerDto(ledger);
  }

  @UseGuards(LedgerAccessGuard)
  @ApiResponse({ status: 201, type: LedgerDto })
  @Post('ledgers/:ledgerId/participants')
  async addParticipant(
    @CurrentUserId() userId: ID,
    @Param('ledgerId') ledgerId: string,
    @Body() body: AddLedgerParticipantDto,
  ) {
    return this.ledgersService.addParticipant(ledgerId, userId, body);
  }

  @UseGuards(LedgerAccessGuard)
  @ApiResponse({ status: 200 })
  @Delete('ledgers/:ledgerId/participants/:userId')
  async removeParticipant(
    @CurrentUserId() userId: ID,
    @Param('ledgerId') ledgerId: string,
    @Param('userId') targetUserId: string,
  ) {
    return this.ledgersService.removeParticipant(ledgerId, userId, targetUserId);
  }
}
