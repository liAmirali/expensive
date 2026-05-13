import {
  PrismaClient,
  GroupRole,
  GroupMembershipStatus,
  LedgerVisibility,
  SplitMethod,
} from '../generated/prisma/client.js';
import argon2 from 'argon2';
import { Decimal } from '../common/utils/decimal.util.js';
import { PrismaService } from './prisma.service.js';

const prisma = new PrismaService();

async function main() {
  const passwordHash = await argon2.hash('Password123!');

  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      passwordHash,
      fullName: 'Alice Example',
      preferredLocale: 'fa-IR',
      preferredCurrency: 'IRR',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      passwordHash,
      fullName: 'Bob Example',
      preferredLocale: 'fa-IR',
      preferredCurrency: 'IRR',
    },
  });

  const group = await prisma.group.create({
    data: {
      name: 'Tehran Trip',
      description: 'Sample group',
      createdById: alice.id,
      memberships: {
        createMany: {
          data: [
            { userId: alice.id, role: GroupRole.OWNER, status: GroupMembershipStatus.ACTIVE },
            { userId: bob.id, role: GroupRole.MEMBER, status: GroupMembershipStatus.ACTIVE },
          ],
        },
      },
    },
  });

  const ledger = await prisma.ledger.create({
    data: {
      groupId: group.id,
      name: 'Hotel Ledger',
      description: 'Shared lodging',
      visibility: LedgerVisibility.PRIVATE_TO_PARTICIPANTS,
      createdById: alice.id,
      participants: {
        createMany: {
          data: [{ userId: alice.id }, { userId: bob.id }],
        },
      },
    },
  });

  await prisma.expense.create({
    data: {
      ledgerId: ledger.id,
      payerId: alice.id,
      title: 'Hotel deposit',
      totalAmount: new Decimal(5000000),
      expenseDate: new Date(),
      splitMethod: SplitMethod.EQUAL,
      createdById: alice.id,
      splits: {
        createMany: {
          data: [
            { userId: alice.id, amountOwed: new Decimal(2500000) },
            { userId: bob.id, amountOwed: new Decimal(2500000) },
          ],
        },
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
