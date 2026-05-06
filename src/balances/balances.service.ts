import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Decimal } from '../common/utils/decimal.util.js';

export type BalanceResult = {
  userId: string;
  net: Decimal;
};

export type SettlementSuggestion = {
  fromUserId: string;
  toUserId: string;
  amount: Decimal;
};

@Injectable()
export class BalancesService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalances(ledgerId: ID, userId: ID) {
    const ledger = await this.prisma.ledger.findUnique({ where: { id: ledgerId } });
    if (!ledger) {
      throw new BadRequestException('Ledger not found.');
    }

    const participant = await this.prisma.ledgerParticipant.findUnique({
      where: { ledgerId_userId: { ledgerId, userId } },
    });

    if (!participant) {
      throw new BadRequestException('Not a ledger participant.');
    }

    const expenses = await this.prisma.expense.findMany({
      where: { ledgerId, isVoided: false },
      include: { splits: true },
    });

    const balances = new Map<string, Decimal>();
    const add = (id: string, amount: Decimal) => {
      balances.set(id, (balances.get(id) ?? new Decimal(0)).add(amount));
    };

    expenses.forEach((expense) => {
      add(expense.payerId, expense.totalAmount);
      expense.splits.forEach((split) => {
        add(split.userId, split.amountOwed.mul(-1));
      });
    });

    const settlements = await this.prisma.settlement.findMany({ where: { ledgerId } });
    settlements.forEach((settlement) => {
      add(settlement.fromUserId, settlement.amount.mul(-1));
      add(settlement.toUserId, settlement.amount);
    });

    const result: BalanceResult[] = Array.from(balances.entries()).map(([id, net]) => ({
      userId: id,
      net,
    }));

    return {
      balances: result,
      suggestions: this.buildSuggestions(result),
    };
  }

  private buildSuggestions(balances: BalanceResult[]): SettlementSuggestion[] {
    const creditors = balances
      .filter((b) => b.net.gt(0))
      .map((b) => ({ ...b, net: new Decimal(b.net) }))
      .sort((a, b) => a.userId.localeCompare(b.userId));
    const debtors = balances
      .filter((b) => b.net.lt(0))
      .map((b) => ({ ...b, net: new Decimal(b.net.abs()) }))
      .sort((a, b) => a.userId.localeCompare(b.userId));

    const suggestions: SettlementSuggestion[] = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amount = Decimal.min(debtor.net, creditor.net);
      if (amount.lte(0)) {
        break;
      }

      suggestions.push({
        fromUserId: debtor.userId,
        toUserId: creditor.userId,
        amount,
      });

      debtor.net = debtor.net.sub(amount);
      creditor.net = creditor.net.sub(amount);

      if (debtor.net.eq(0)) i++;
      if (creditor.net.eq(0)) j++;
    }

    return suggestions;
  }
}
