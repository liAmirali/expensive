import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class LedgerParticipantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ledgerIdParam: ID | undefined = request.params?.ledgerId;
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

    const participant = await this.prisma.ledgerParticipant.findUnique({
      where: { ledgerId_userId: { ledgerId, userId } },
    });

    if (!participant) {
      throw new ForbiddenException('Not a ledger participant.');
    }

    return true;
  }
}
