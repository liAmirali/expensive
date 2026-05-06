import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LedgersService } from './ledgers.service.js';
import { AddLedgerParticipantDto, CreateLedgerDto, LedgerDto, UpdateLedgerDto } from './dto/ledger.dto.js';
import type { Request } from 'express';
import { GroupMembershipGuard } from '../common/guards/group-membership.guard.js';
import { LedgerAccessGuard } from '../common/guards/ledger-access.guard.js';

@ApiBearerAuth()
@ApiTags('Ledgers')
@Controller()
export class LedgersController {
  constructor(private readonly ledgersService: LedgersService) {}

  @UseGuards(GroupMembershipGuard)
  @ApiResponse({ status: 201, type: LedgerDto })
  @Post('groups/:groupId/ledgers')
  async createLedger(
    @Req() req: Request,
    @Param('groupId') groupId: string,
    @Body() body: CreateLedgerDto,
  ) {
    const userId: ID = (req['user'] as { id: ID }).id;
    const ledger = await this.ledgersService.create(groupId, userId, body);
    return new LedgerDto(ledger);
  }

  @UseGuards(GroupMembershipGuard)
  @ApiResponse({ status: 200, type: LedgerDto, isArray: true })
  @Get('groups/:groupId/ledgers')
  async listLedgers(@Req() req: Request, @Param('groupId') groupId: string) {
    const userId: ID = (req['user'] as { id: ID }).id;
    const ledgers = await this.ledgersService.listByGroup(groupId, userId);
    return ledgers.map((ledger) => new LedgerDto(ledger));
  }

  @UseGuards(LedgerAccessGuard)
  @ApiResponse({ status: 200, type: LedgerDto })
  @Get('ledgers/:ledgerId')
  async getLedger(@Req() req: Request, @Param('ledgerId') ledgerId: string) {
    const userId: ID = (req['user'] as { id: ID }).id;
    const ledger = await this.ledgersService.findById(ledgerId, userId);
    return new LedgerDto(ledger);
  }

  @UseGuards(LedgerAccessGuard)
  @ApiResponse({ status: 200, type: LedgerDto })
  @Patch('ledgers/:ledgerId')
  async updateLedger(
    @Req() req: Request,
    @Param('ledgerId') ledgerId: string,
    @Body() body: UpdateLedgerDto,
  ) {
    const userId: ID = (req['user'] as { id: ID }).id;
    const ledger = await this.ledgersService.update(ledgerId, userId, body);
    return new LedgerDto(ledger);
  }

  @UseGuards(LedgerAccessGuard)
  @ApiResponse({ status: 201, type: LedgerDto })
  @Post('ledgers/:ledgerId/participants')
  async addParticipant(
    @Req() req: Request,
    @Param('ledgerId') ledgerId: string,
    @Body() body: AddLedgerParticipantDto,
  ) {
    const userId: ID = (req['user'] as { id: ID }).id;
    return this.ledgersService.addParticipant(ledgerId, userId, body);
  }
}
