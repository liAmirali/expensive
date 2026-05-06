import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSettlementDto } from './dto/settlement.dto.js';
import { toDecimal } from '../common/utils/decimal.util.js';
import { GroupMembershipStatus } from '../generated/prisma/client.js';
import { BalancesService } from '../balances/balances.service.js';

@Injectable()
export class SettlementsService {
  private readonly logger = new Logger(SettlementsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly balancesService: BalancesService,
  ) {}

  async create(ledgerId: ID, userId: ID, dto: CreateSettlementDto) {
    const ledger = await this.prisma.ledger.findUnique({ where: { id: ledgerId } });
    if (!ledger) {
      throw new NotFoundException('Ledger not found.');
    }

    if (ledger.closedAt) {
      throw new BadRequestException('Ledger is closed.');
    }

    const membership = await this.prisma.groupMembership.findFirst({
      where: {
        groupId: ledger.groupId,
        userId,
        status: GroupMembershipStatus.ACTIVE,
      },
    });

    if (!membership) {
      throw new BadRequestException('Not a group member.');
    }

    const fromParticipant = await this.prisma.ledgerParticipant.findUnique({
      where: { ledgerId_userId: { ledgerId, userId: dto.fromUserId } },
    });
    const toParticipant = await this.prisma.ledgerParticipant.findUnique({
      where: { ledgerId_userId: { ledgerId, userId: dto.toUserId } },
    });

    if (!fromParticipant || !toParticipant) {
      throw new BadRequestException('Settlement users must be ledger participants.');
    }

    if (dto.fromUserId === dto.toUserId) {
      throw new BadRequestException('Cannot settle to the same user.');
    }

    const amount = toDecimal(dto.amount);
    if (amount.lte(0)) {
      throw new BadRequestException('Settlement amount must be positive.');
    }

    const balances = await this.balancesService.getBalances(ledgerId, userId);
    const fromBalance = balances.balances.find((b) => b.userId === dto.fromUserId);

    if (!fromBalance || fromBalance.net.gte(0)) {
      throw new BadRequestException('From user does not owe anything.');
    }

    const owed = fromBalance.net.abs();
    if (amount.gt(owed)) {
      throw new BadRequestException('Settlement amount exceeds outstanding debt.');
    }

    const settlement = await this.prisma.settlement.create({
      data: {
        ledgerId,
        fromUserId: dto.fromUserId,
        toUserId: dto.toUserId,
        amount,
        settlementDate: new Date(dto.settlementDate),
        note: dto.note,
      },
    });

    this.logger.log(`Settlement created ${settlement.id}`);
    return settlement;
  }

  async list(ledgerId: ID, userId: ID) {
    const ledger = await this.prisma.ledger.findUnique({ where: { id: ledgerId } });
    if (!ledger) {
      throw new NotFoundException('Ledger not found.');
    }

    const membership = await this.prisma.groupMembership.findFirst({
      where: { groupId: ledger.groupId, userId, status: GroupMembershipStatus.ACTIVE },
    });

    if (!membership) {
      throw new BadRequestException('Not a group member.');
    }

    return this.prisma.settlement.findMany({
      where: { ledgerId },
      orderBy: { settlementDate: 'desc' },
    });
  }
}
