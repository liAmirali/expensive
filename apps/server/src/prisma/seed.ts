import 'dotenv/config';
import {
  GroupRole,
  GroupMembershipStatus,
  LedgerVisibility,
  SplitMethod,
} from '../generated/prisma/client.js';
import argon2 from 'argon2';
import { Decimal } from '../common/utils/decimal.util.js';
import { PrismaService } from './prisma.service.js';

const prisma = new PrismaService();

type SeedUser = {
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
};

const seedUsers: SeedUser[] = [
  { email: 'alice@example.com', fullName: 'Alice Ahmadi', phoneNumber: '+989120000001' },
  { email: 'bob@example.com', fullName: 'Bob Bahrami', phoneNumber: '+989120000002' },
  { email: 'sara@example.com', fullName: 'Sara Sadeghi', phoneNumber: '+989120000003' },
  { email: 'reza@example.com', fullName: 'Reza Rahimi', phoneNumber: '+989120000004' },
  { email: 'mina@example.com', fullName: 'Mina Mohammadi', phoneNumber: '+989120000005' },
  { email: 'navid@example.com', fullName: 'Navid Nouri', phoneNumber: '+989120000006' },
  { email: 'leila@example.com', fullName: 'Leila Lotfi', phoneNumber: '+989120000007' },
  { email: 'kian@example.com', fullName: 'Kian Karimi', phoneNumber: '+989120000008' },
  { email: 'nazanin@example.com', fullName: 'Nazanin Najafi', phoneNumber: '+989120000009' },
  { email: 'omid@example.com', fullName: 'Omid Olfati', phoneNumber: '+989120000010' },
  { email: 'parisa@example.com', fullName: 'Parisa Parsa', phoneNumber: '+989120000011' },
  { email: 'hossein@example.com', fullName: 'Hossein Hashemi', phoneNumber: '+989120000012' },
];

const equalSplit = (total: number, count: number): Decimal[] => {
  const base = Math.floor((total * 1_000_000) / count);
  const remainder = total * 1_000_000 - base * count;
  return Array.from({ length: count }, (_, i) =>
    new Decimal((base + (i === 0 ? remainder : 0)) / 1_000_000),
  );
};

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

async function wipe() {
  await prisma.settlement.deleteMany();
  await prisma.expenseSplit.deleteMany();
  await prisma.item.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.ledgerParticipant.deleteMany();
  await prisma.ledger.deleteMany();
  await prisma.groupMembership.deleteMany();
  await prisma.group.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await wipe();

  const passwordHash = await argon2.hash('Password123!');

  const users = await Promise.all(
    seedUsers.map((u) =>
      prisma.user.create({
        data: {
          email: u.email,
          passwordHash,
          fullName: u.fullName,
          phoneNumber: u.phoneNumber,
          avatarUrl: u.avatarUrl,
          preferredLocale: 'fa-IR',
          preferredCurrency: 'IRR',
          emailVerified: true,
        },
      }),
    ),
  );

  const byEmail = Object.fromEntries(users.map((u) => [u.email, u]));
  const alice = byEmail['alice@example.com'];
  const bob = byEmail['bob@example.com'];
  const sara = byEmail['sara@example.com'];
  const reza = byEmail['reza@example.com'];
  const mina = byEmail['mina@example.com'];
  const navid = byEmail['navid@example.com'];
  const leila = byEmail['leila@example.com'];
  const kian = byEmail['kian@example.com'];
  const nazanin = byEmail['nazanin@example.com'];
  const omid = byEmail['omid@example.com'];
  const parisa = byEmail['parisa@example.com'];
  const hossein = byEmail['hossein@example.com'];

  // Group 1: Tehran Trip — 6 members
  const tehranMembers = [alice, bob, sara, reza, mina, navid];
  const tehran = await prisma.group.create({
    data: {
      name: 'سفر تهران',
      description: 'سفر گروهی به تهران',
      createdById: alice.id,
      memberships: {
        createMany: {
          data: tehranMembers.map((u, i) => ({
            userId: u.id,
            role: i === 0 ? GroupRole.OWNER : i === 1 ? GroupRole.ADMIN : GroupRole.MEMBER,
            status: GroupMembershipStatus.ACTIVE,
            invitedById: i === 0 ? null : alice.id,
          })),
        },
      },
    },
  });

  const hotelLedger = await prisma.ledger.create({
    data: {
      groupId: tehran.id,
      name: 'هتل',
      description: 'هزینه‌های اقامت',
      visibility: LedgerVisibility.VISIBLE_TO_GROUP,
      createdById: alice.id,
      participants: {
        createMany: { data: tehranMembers.map((u) => ({ userId: u.id })) },
      },
    },
  });

  const foodLedger = await prisma.ledger.create({
    data: {
      groupId: tehran.id,
      name: 'غذا و رستوران',
      visibility: LedgerVisibility.VISIBLE_TO_GROUP,
      createdById: bob.id,
      participants: {
        createMany: { data: tehranMembers.map((u) => ({ userId: u.id })) },
      },
    },
  });

  const hotelSplits = equalSplit(12_000_000, tehranMembers.length);
  await prisma.expense.create({
    data: {
      ledgerId: hotelLedger.id,
      payerId: alice.id,
      title: 'ودیعه هتل',
      description: 'هتل اسپیناس، ۳ شب',
      totalAmount: new Decimal(12_000_000),
      expenseDate: daysAgo(7),
      splitMethod: SplitMethod.EQUAL,
      createdById: alice.id,
      splits: {
        createMany: {
          data: tehranMembers.map((u, i) => ({ userId: u.id, amountOwed: hotelSplits[i] })),
        },
      },
    },
  });

  await prisma.expense.create({
    data: {
      ledgerId: hotelLedger.id,
      payerId: bob.id,
      title: 'صبحانه هتل',
      totalAmount: new Decimal(1_800_000),
      expenseDate: daysAgo(6),
      splitMethod: SplitMethod.EQUAL,
      createdById: bob.id,
      splits: {
        createMany: {
          data: equalSplit(1_800_000, tehranMembers.length).map((amt, i) => ({
            userId: tehranMembers[i].id,
            amountOwed: amt,
          })),
        },
      },
    },
  });

  await prisma.expense.create({
    data: {
      ledgerId: foodLedger.id,
      payerId: sara.id,
      title: 'شام رستوران',
      description: 'رستوران دیزی‌سرا',
      totalAmount: new Decimal(3_600_000),
      expenseDate: daysAgo(5),
      splitMethod: SplitMethod.ITEMIZED,
      createdById: sara.id,
      splits: {
        createMany: {
          data: [
            { userId: alice.id, amountOwed: new Decimal(700_000) },
            { userId: bob.id, amountOwed: new Decimal(600_000) },
            { userId: sara.id, amountOwed: new Decimal(500_000) },
            { userId: reza.id, amountOwed: new Decimal(650_000) },
            { userId: mina.id, amountOwed: new Decimal(550_000) },
            { userId: navid.id, amountOwed: new Decimal(600_000) },
          ],
        },
      },
      items: {
        createMany: {
          data: [
            { name: 'چلوکباب', amount: new Decimal(450_000), quantity: 6 },
            { name: 'دوغ', amount: new Decimal(80_000), quantity: 6 },
            { name: 'سالاد', amount: new Decimal(120_000), quantity: 3 },
          ],
        },
      },
    },
  });

  await prisma.expense.create({
    data: {
      ledgerId: foodLedger.id,
      payerId: reza.id,
      title: 'نهار کافه',
      totalAmount: new Decimal(2_400_000),
      expenseDate: daysAgo(3),
      splitMethod: SplitMethod.PERCENTAGE,
      createdById: reza.id,
      splits: {
        createMany: {
          data: [
            { userId: alice.id, amountOwed: new Decimal(400_000) },
            { userId: bob.id, amountOwed: new Decimal(400_000) },
            { userId: sara.id, amountOwed: new Decimal(400_000) },
            { userId: reza.id, amountOwed: new Decimal(400_000) },
            { userId: mina.id, amountOwed: new Decimal(400_000) },
            { userId: navid.id, amountOwed: new Decimal(400_000) },
          ],
        },
      },
    },
  });

  await prisma.settlement.create({
    data: {
      ledgerId: hotelLedger.id,
      fromUserId: navid.id,
      toUserId: alice.id,
      amount: new Decimal(2_000_000),
      settlementDate: daysAgo(2),
      note: 'تسویه نقدی هتل',
    },
  });

  // Group 2: Apartment — 4 roommates, ongoing
  const aptMembers = [leila, kian, nazanin, omid];
  const apt = await prisma.group.create({
    data: {
      name: 'آپارتمان شریعتی',
      description: 'هم‌خانه‌ای‌ها',
      createdById: leila.id,
      memberships: {
        createMany: {
          data: aptMembers.map((u, i) => ({
            userId: u.id,
            role: i === 0 ? GroupRole.OWNER : GroupRole.MEMBER,
            status: GroupMembershipStatus.ACTIVE,
            invitedById: i === 0 ? null : leila.id,
          })),
        },
      },
    },
  });

  const utilitiesLedger = await prisma.ledger.create({
    data: {
      groupId: apt.id,
      name: 'قبوض',
      description: 'برق، گاز، اینترنت',
      visibility: LedgerVisibility.VISIBLE_TO_GROUP,
      createdById: leila.id,
      participants: { createMany: { data: aptMembers.map((u) => ({ userId: u.id })) } },
    },
  });

  const groceriesLedger = await prisma.ledger.create({
    data: {
      groupId: apt.id,
      name: 'خرید خانه',
      visibility: LedgerVisibility.VISIBLE_TO_GROUP,
      createdById: kian.id,
      participants: { createMany: { data: aptMembers.map((u) => ({ userId: u.id })) } },
    },
  });

  for (const [idx, item] of [
    { title: 'قبض برق', payer: leila, amount: 1_600_000, daysBack: 25 },
    { title: 'قبض گاز', payer: kian, amount: 900_000, daysBack: 20 },
    { title: 'اینترنت ماهانه', payer: nazanin, amount: 750_000, daysBack: 14 },
  ].entries()) {
    const splits = equalSplit(item.amount, aptMembers.length);
    await prisma.expense.create({
      data: {
        ledgerId: utilitiesLedger.id,
        payerId: item.payer.id,
        title: item.title,
        totalAmount: new Decimal(item.amount),
        expenseDate: daysAgo(item.daysBack),
        splitMethod: SplitMethod.EQUAL,
        createdById: item.payer.id,
        splits: {
          createMany: {
            data: aptMembers.map((u, i) => ({ userId: u.id, amountOwed: splits[i] })),
          },
        },
      },
    });
    void idx;
  }

  await prisma.expense.create({
    data: {
      ledgerId: groceriesLedger.id,
      payerId: omid.id,
      title: 'خرید هفتگی',
      description: 'هایپراستار',
      totalAmount: new Decimal(2_800_000),
      expenseDate: daysAgo(4),
      splitMethod: SplitMethod.EXACT,
      createdById: omid.id,
      splits: {
        createMany: {
          data: [
            { userId: leila.id, amountOwed: new Decimal(800_000) },
            { userId: kian.id, amountOwed: new Decimal(600_000) },
            { userId: nazanin.id, amountOwed: new Decimal(700_000) },
            { userId: omid.id, amountOwed: new Decimal(700_000) },
          ],
        },
      },
    },
  });

  await prisma.settlement.create({
    data: {
      ledgerId: utilitiesLedger.id,
      fromUserId: kian.id,
      toUserId: leila.id,
      amount: new Decimal(400_000),
      settlementDate: daysAgo(10),
      note: 'سهم برق',
    },
  });

  // Group 3: Office Lunch — pending invites
  const officeActive = [parisa, hossein, alice];
  const office = await prisma.group.create({
    data: {
      name: 'ناهار اداره',
      description: 'صندوق ناهار همکاران',
      createdById: parisa.id,
      memberships: {
        createMany: {
          data: [
            ...officeActive.map((u, i) => ({
              userId: u.id,
              role: i === 0 ? GroupRole.OWNER : GroupRole.MEMBER,
              status: GroupMembershipStatus.ACTIVE,
              invitedById: i === 0 ? null : parisa.id,
            })),
            {
              userId: reza.id,
              role: GroupRole.MEMBER,
              status: GroupMembershipStatus.PENDING,
              invitedById: parisa.id,
            },
            {
              userId: mina.id,
              role: GroupRole.MEMBER,
              status: GroupMembershipStatus.PENDING,
              invitedById: parisa.id,
            },
          ],
        },
      },
    },
  });

  const lunchLedger = await prisma.ledger.create({
    data: {
      groupId: office.id,
      name: 'ناهار هفته',
      visibility: LedgerVisibility.PRIVATE_TO_PARTICIPANTS,
      createdById: parisa.id,
      participants: { createMany: { data: officeActive.map((u) => ({ userId: u.id })) } },
    },
  });

  const lunchSplit = equalSplit(900_000, officeActive.length);
  await prisma.expense.create({
    data: {
      ledgerId: lunchLedger.id,
      payerId: parisa.id,
      title: 'ناهار دوشنبه',
      totalAmount: new Decimal(900_000),
      expenseDate: daysAgo(1),
      splitMethod: SplitMethod.EQUAL,
      createdById: parisa.id,
      splits: {
        createMany: {
          data: officeActive.map((u, i) => ({ userId: u.id, amountOwed: lunchSplit[i] })),
        },
      },
    },
  });

  console.log(
    `Seeded: ${users.length} users, 3 groups, ${4} ledgers, multiple expenses + settlements.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });