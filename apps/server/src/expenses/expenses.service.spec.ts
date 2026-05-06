import { ExpensesService } from './expenses.service.js';
import { BadRequestException } from '@nestjs/common';

const prismaMock = {
  ledger: {
    findUnique: jest.fn(),
  },
  groupMembership: {
    findFirst: jest.fn(),
  },
  ledgerParticipant: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  expense: {
    create: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback({ expense: { create: jest.fn() } })),
};

describe('ExpensesService', () => {
  it('rejects mismatched currency', async () => {
    prismaMock.ledger.findUnique.mockResolvedValue({
      id: '1',
      currency: 'IRR',
      groupId: 'g1',
      closedAt: null,
      expenses: [],
    });
    prismaMock.groupMembership.findFirst.mockResolvedValue({});
    prismaMock.ledgerParticipant.findUnique.mockResolvedValue({});
    prismaMock.ledgerParticipant.findMany.mockResolvedValue([{ userId: 'u1' }]);

    const service = new ExpensesService(prismaMock as any);

    await expect(
      service.create('1', 'u1', {
        payerId: 'u1',
        title: 'Test',
        totalAmount: '100',
        currency: 'USD',
        expenseDate: new Date().toISOString(),
        splitMethod: 'EQUAL',
        splits: [{ userId: 'u1', amountOwed: '100' }],
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
