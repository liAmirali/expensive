import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { GroupMembershipStatus, LedgerVisibility } from '../generated/prisma/client.js';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto.js';
import { Prisma } from '../generated/prisma/client.js';
import { toDecimal } from '../common/utils/decimal.util.js';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(ledgerId: ID, createdById: ID, dto: CreateExpenseDto) {
    const ledger = await this.prisma.ledger.findUnique({
      where: { id: ledgerId },
      include: { expenses: { take: 1 } },
    });
    if (!ledger) {
      throw new NotFoundException('Ledger not found.');
    }

    if (ledger.closedAt) {
      throw new BadRequestException('Ledger is closed.');
    }

    const membership = await this.prisma.groupMembership.findFirst({
      where: {
        groupId: ledger.groupId,
        userId: createdById,
        status: GroupMembershipStatus.ACTIVE,
      },
    });

    if (!membership) {
      throw new BadRequestException('Not a group member.');
    }

    const participant = await this.prisma.ledgerParticipant.findUnique({
      where: { ledgerId_userId: { ledgerId, userId: dto.payerId } },
    });

    if (!participant) {
      throw new BadRequestException('Payer must be a ledger participant.');
    }

    const totalAmount = toDecimal(dto.totalAmount);
    if (totalAmount.lte(0)) {
      throw new BadRequestException('Total amount must be greater than zero.');
    }

    const splits = dto.splits.map((split) => ({
      userId: split.userId,
      amountOwed: toDecimal(split.amountOwed),
    }));

    const splitSum = splits.reduce((acc, curr) => acc.add(curr.amountOwed), new Prisma.Decimal(0));
    if (!splitSum.eq(totalAmount)) {
      throw new BadRequestException('Splits must sum to total amount.');
    }

    const participantIds = await this.prisma.ledgerParticipant.findMany({
      where: { ledgerId },
      select: { userId: true },
    });
    const allowedUserIds = new Set(participantIds.map((p) => p.userId));

    for (const split of splits) {
      if (!allowedUserIds.has(split.userId)) {
        throw new BadRequestException('All splits must belong to ledger participants.');
      }
    }

    if (dto.splitMethod === 'ITEMIZED') {
      if (!dto.items || dto.items.length === 0) {
        throw new BadRequestException('Itemized expenses require items.');
      }

      const itemsTotal = dto.items
        .map((item) => toDecimal(item.amount).mul(item.quantity))
        .reduce((acc, curr) => acc.add(curr), new Prisma.Decimal(0));

      if (!itemsTotal.eq(totalAmount)) {
        throw new BadRequestException('Item totals must equal total amount.');
      }
    } else if (dto.items && dto.items.length > 0) {
      throw new BadRequestException('Items are only allowed for ITEMIZED split method.');
    }

    const data: Prisma.ExpenseCreateInput = {
      ledger: { connect: { id: ledgerId } },
      payer: { connect: { id: dto.payerId } },
      title: dto.title,
      description: dto.description,
      totalAmount,
      expenseDate: new Date(dto.expenseDate),
      splitMethod: dto.splitMethod,
      createdBy: { connect: { id: createdById } },
      splits: {
        create: splits.map((split) => ({
          user: { connect: { id: split.userId } },
          amountOwed: split.amountOwed,
        })),
      },
      items: dto.items
        ? {
            create: dto.items.map((item) => ({
              name: item.name,
              amount: toDecimal(item.amount),
              quantity: item.quantity,
            })),
          }
        : undefined,
    };

    const expense = await this.prisma.$transaction(async (tx) => {
      const createdExpense = await tx.expense.create({ data });
      this.logger.log(`Expense created ${createdExpense.id}`);
      return createdExpense;
    });

    return expense;
  }

  async list(ledgerId: ID, userId: ID) {
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

    if (!membership) {
      throw new BadRequestException('Not a group member.');
    }

    const participant = await this.prisma.ledgerParticipant.findUnique({
      where: { ledgerId_userId: { ledgerId, userId } },
    });

    if (ledger.visibility === LedgerVisibility.PRIVATE_TO_PARTICIPANTS && !participant) {
      throw new BadRequestException('Not a ledger participant.');
    }

    return this.prisma.expense.findMany({
      where: {
        ledgerId,
        isVoided: false,
      },
      include: {
        splits: true,
        items: true,
      },
      orderBy: { expenseDate: 'desc' },
    });
  }

  async update(expenseId: ID, userId: ID, dto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId },
      include: { ledger: true },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found.');
    }

    if (expense.ledger.closedAt) {
      throw new BadRequestException('Ledger is closed.');
    }

    const membership = await this.prisma.groupMembership.findFirst({
      where: { groupId: expense.ledger.groupId, userId, status: GroupMembershipStatus.ACTIVE },
    });

    if (!membership) {
      throw new BadRequestException('Not a group member.');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.items && dto.splitMethod && dto.splitMethod !== 'ITEMIZED') {
        throw new BadRequestException('Items are only allowed for ITEMIZED split method.');
      }

      if (dto.splits) {
        const totalAmount = dto.splits
          .map((split) => toDecimal(split.amountOwed))
          .reduce((acc, curr) => acc.add(curr), new Prisma.Decimal(0));
        if (dto.splitMethod && dto.splitMethod !== expense.splitMethod) {
          await tx.expense.update({
            where: { id: expenseId },
            data: { splitMethod: dto.splitMethod },
          });
        }

        if (totalAmount.lte(0)) {
          throw new BadRequestException('Total amount must be greater than zero.');
        }

        await tx.expenseSplit.deleteMany({ where: { expenseId } });
        await tx.expenseSplit.createMany({
          data: dto.splits.map((split) => ({
            expenseId,
            userId: split.userId,
            amountOwed: toDecimal(split.amountOwed),
          })),
        });

        await tx.expense.update({
          where: { id: expenseId },
          data: {
            totalAmount,
          },
        });
      }

      if (dto.items) {
        await tx.item.deleteMany({ where: { expenseId } });
        await tx.item.createMany({
          data: dto.items.map((item) => ({
            expenseId,
            name: item.name,
            amount: toDecimal(item.amount),
            quantity: item.quantity,
          })),
        });

        if (dto.splitMethod === 'ITEMIZED') {
          const itemsTotal = dto.items
            .map((item) => toDecimal(item.amount).mul(item.quantity))
            .reduce((acc, curr) => acc.add(curr), new Prisma.Decimal(0));
          const updatedExpense = await tx.expense.findUnique({
            where: { id: expenseId },
            select: { totalAmount: true },
          });
          if (updatedExpense && !itemsTotal.eq(updatedExpense.totalAmount)) {
            throw new BadRequestException('Item totals must equal total amount.');
          }
        }
      }

      return tx.expense.update({
        where: { id: expenseId },
        data: {
          title: dto.title,
          description: dto.description,
          expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : undefined,
          splitMethod: dto.splitMethod,
        },
      });
    });

    this.logger.log(`Expense updated ${expenseId}`);
    return updated;
  }

  async void(expenseId: ID, userId: ID) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId },
      include: { ledger: true },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found.');
    }

    if (expense.ledger.closedAt) {
      throw new BadRequestException('Ledger is closed.');
    }

    const membership = await this.prisma.groupMembership.findFirst({
      where: { groupId: expense.ledger.groupId, userId, status: GroupMembershipStatus.ACTIVE },
    });

    if (!membership) {
      throw new BadRequestException('Not a group member.');
    }

    return this.prisma.expense.update({
      where: { id: expenseId },
      data: { isVoided: true },
    });
  }
}
