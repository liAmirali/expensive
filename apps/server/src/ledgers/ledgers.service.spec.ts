import { LedgersService } from './ledgers.service.js';
import { BadRequestException } from '@nestjs/common';

const prismaMock = {
  groupMembership: { findFirst: jest.fn(), findMany: jest.fn() },
  group: { findUnique: jest.fn() },
  ledger: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
  ledgerParticipant: { create: jest.fn(), findUnique: jest.fn() },
};

describe('LedgersService', () => {
  it('requires participants for ledger creation', async () => {
    prismaMock.groupMembership.findFirst.mockResolvedValue({ role: 'OWNER', status: 'ACTIVE' });
    prismaMock.group.findUnique.mockResolvedValue({ id: 'g1', baseCurrency: 'IRR' });

    const service = new LedgersService(prismaMock as any);

    await expect(
      service.create('g1', 'u1', { name: 'Ledger', participants: [] } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
