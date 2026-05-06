import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { GroupMembershipStatus, LedgerVisibility } from '../../generated/prisma/client.js';

@Injectable()
export class LedgerAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ledgerIdParam: ID | undefined = request.params?.ledgerId || request.params?.id;
    const expenseIdParam: ID | undefined = request.params?.expenseId;
    const userId: ID | undefined = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('Missing user context.');
    }

    let ledgerId = ledgerIdParam;
    if (!ledgerId && expenseIdParam) {
      const expense = await this.prisma.expense.findUnique({
        where: { id: expenseIdParam },
        select: { ledgerId: true },
      });
      ledgerId = expense?.ledgerId;
    }

    if (!ledgerId) {
      throw new ForbiddenException('Missing ledger context.');
    }

    const ledger = await this.prisma.ledger.findUnique({
      where: { id: ledgerId },
    });

    if (!ledger) {
      throw new ForbiddenException('Ledger not found.');
    }

    const membership = await this.prisma.groupMembership.findFirst({
      where: {
        groupId: ledger.groupId,
        userId,
        status: GroupMembershipStatus.ACTIVE,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Not a group member.');
    }

    const participant = await this.prisma.ledgerParticipant.findUnique({
      where: { ledgerId_userId: { ledgerId, userId } },
    });

    const isParticipant = Boolean(participant);

    if (ledger.visibility === LedgerVisibility.PRIVATE_TO_PARTICIPANTS && !isParticipant) {
      throw new ForbiddenException('Not a ledger participant.');
    }

    request.ledger = ledger;
    request.ledgerMembership = { role: membership.role, isParticipant };
    return true;
  }
}
