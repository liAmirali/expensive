import { Prisma } from '../../generated/prisma/client.js';

export const Decimal = Prisma.Decimal;
export type Decimal = Prisma.Decimal;

export function toDecimal(value: string | number | Prisma.Decimal): Prisma.Decimal {
  if (value instanceof Prisma.Decimal) {
    return value;
  }
  return new Prisma.Decimal(value);
}

export function add(a: Prisma.Decimal, b: Prisma.Decimal): Prisma.Decimal {
  return a.add(b);
}

export function sub(a: Prisma.Decimal, b: Prisma.Decimal): Prisma.Decimal {
  return a.sub(b);
}

export function isZero(value: Prisma.Decimal): boolean {
  return value.eq(0);
}

export function roundForDisplay(value: Prisma.Decimal): string {
  return value.toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP).toFixed(0);
}

export function ensurePositive(value: Prisma.Decimal, message: string) {
  if (value.lte(0)) {
    throw new Error(message);
  }
}
