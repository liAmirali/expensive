import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  GroupMembershipStatus,
  GroupRole,
  LedgerVisibility,
} from '../generated/prisma/client.js';
import { AddLedgerParticipantDto, CreateLedgerDto, UpdateLedgerDto } from './dto/ledger.dto.js';

@Injectable()
export class LedgersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(groupId: ID, createdById: ID, dto: CreateLedgerDto) {
    const membership = await this.prisma.groupMembership.findFirst({
      where: {
        groupId,
        userId: createdById,
        status: GroupMembershipStatus.ACTIVE,
      },
    });

    if (!membership || (membership.role !== GroupRole.OWNER && membership.role !== GroupRole.ADMIN)) {
      throw new BadRequestException('You are not allowed to create a ledger.');
    }

    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException('Group not found.');
    }

    if (!dto.participants?.length) {
      throw new BadRequestException('Ledger must have at least one participant.');
    }

    const participantIds = dto.participants.map((p) => p.userId);
    if (!participantIds.includes(createdById)) {
      participantIds.push(createdById);
    }
    const uniqueParticipantIds = Array.from(new Set(participantIds));
    const validMembers = await this.prisma.groupMembership.findMany({
      where: {
        groupId,
        userId: { in: uniqueParticipantIds },
        status: GroupMembershipStatus.ACTIVE,
      },
    });

    if (validMembers.length !== uniqueParticipantIds.length) {
      throw new BadRequestException('All participants must belong to the group.');
    }

    return this.prisma.ledger.create({
      data: {
        groupId,
        name: dto.name,
        description: dto.description,
        visibility: dto.visibility ?? LedgerVisibility.PRIVATE_TO_PARTICIPANTS,
        createdById,
        participants: {
          createMany: {
            data: uniqueParticipantIds.map((userId) => ({ userId })),
          },
        },
      },
      include: this.participantInclude(),
    });
  }

  private participantInclude() {
    return {
      participants: {
        select: {
          userId: true,
          joinedAt: true,
          user: { select: { id: true, email: true, fullName: true } },
        },
      },
    } as const;
  }

  async listByGroup(groupId: ID, userId: ID) {
    const membership = await this.prisma.groupMembership.findFirst({
      where: { groupId, userId, status: GroupMembershipStatus.ACTIVE },
    });
    if (!membership) {
      throw new BadRequestException('Not a group member.');
    }

    return this.prisma.ledger.findMany({
      where: { groupId },
      include: this.participantInclude(),
    });
  }

  async findById(ledgerId: ID, userId: ID) {
    const ledger = await this.prisma.ledger.findUnique({
      where: { id: ledgerId },
      include: this.participantInclude(),
    });
    if (!ledger) {
      throw new NotFoundException('Ledger not found.');
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

    const participant = await this.prisma.ledgerParticipant.findUnique({
      where: { ledgerId_userId: { ledgerId, userId } },
    });

    if (ledger.visibility === LedgerVisibility.PRIVATE_TO_PARTICIPANTS && !participant) {
      throw new BadRequestException('Not a ledger participant.');
    }

    return ledger;
  }

  async update(ledgerId: ID, userId: ID, dto: UpdateLedgerDto) {
    const ledger = await this.prisma.ledger.findUnique({ where: { id: ledgerId } });
    if (!ledger) {
      throw new NotFoundException('Ledger not found.');
    }

    const membership = await this.prisma.groupMembership.findFirst({
      where: {
        groupId: ledger.groupId,
        userId,
        status: GroupMembershipStatus.ACTIVE,
      },
    });

    if (!membership || (membership.role !== GroupRole.OWNER && membership.role !== GroupRole.ADMIN)) {
      throw new BadRequestException('Not allowed to update ledger.');
    }

    if (dto.closedAt) {
      return this.prisma.ledger.update({
        where: { id: ledgerId },
        data: {
          name: dto.name,
          description: dto.description,
          visibility: dto.visibility,
          closedAt: new Date(dto.closedAt),
        },
        include: this.participantInclude(),
      });
    }

    return this.prisma.ledger.update({
      where: { id: ledgerId },
      data: {
        name: dto.name,
        description: dto.description,
        visibility: dto.visibility,
      },
      include: this.participantInclude(),
    });
  }

  async removeParticipant(ledgerId: ID, userId: ID, targetUserId: ID) {
    const ledger = await this.prisma.ledger.findUnique({ where: { id: ledgerId } });
    if (!ledger) {
      throw new NotFoundException('Ledger not found.');
    }

    const membership = await this.prisma.groupMembership.findFirst({
      where: { groupId: ledger.groupId, userId, status: GroupMembershipStatus.ACTIVE },
    });

    if (!membership || (membership.role !== GroupRole.OWNER && membership.role !== GroupRole.ADMIN)) {
      throw new BadRequestException('Not allowed to remove participant.');
    }

    const participant = await this.prisma.ledgerParticipant.findUnique({
      where: { ledgerId_userId: { ledgerId, userId: targetUserId } },
    });
    if (!participant) {
      throw new NotFoundException('Participant not found.');
    }

    const hasActivity = await this.prisma.expense.findFirst({
      where: {
        ledgerId,
        OR: [
          { payerId: targetUserId },
          { splits: { some: { userId: targetUserId } } },
        ],
      },
    });
    if (hasActivity) {
      throw new BadRequestException('Cannot remove participant with existing expense activity.');
    }

    await this.prisma.ledgerParticipant.delete({
      where: { ledgerId_userId: { ledgerId, userId: targetUserId } },
    });
    return { ok: true };
  }

  async addParticipant(ledgerId: ID, userId: ID, dto: AddLedgerParticipantDto) {
    const ledger = await this.prisma.ledger.findUnique({ where: { id: ledgerId } });
    if (!ledger) {
      throw new NotFoundException('Ledger not found.');
    }

    const membership = await this.prisma.groupMembership.findFirst({
      where: { groupId: ledger.groupId, userId, status: GroupMembershipStatus.ACTIVE },
    });

    if (!membership || (membership.role !== GroupRole.OWNER && membership.role !== GroupRole.ADMIN)) {
      throw new BadRequestException('Not allowed to add participant.');
    }

    const member = await this.prisma.groupMembership.findFirst({
      where: {
        groupId: ledger.groupId,
        userId: dto.userId,
        status: GroupMembershipStatus.ACTIVE,
      },
    });

    if (!member) {
      throw new BadRequestException('User must be an active group member.');
    }

    return this.prisma.ledgerParticipant.create({
      data: { ledgerId, userId: dto.userId },
    });
  }
}
