import { BalancesService } from './balances.service.js';
import { Decimal } from '../common/utils/decimal.util.js';

describe('BalancesService', () => {
  it('computes settlement suggestions deterministically', () => {
    // TODO: Mock the PrismaService injectable
    const service = new BalancesService({} as any);

    const balances = [
      { userId: 'a', net: new Decimal(10) },
      { userId: 'b', net: new Decimal(-4) },
      { userId: 'c', net: new Decimal(-6) },
    ];

    // @ts-expect-error Testing only intended action
    const suggestions = service.buildSuggestions(balances);

    expect(suggestions).toEqual([
      { fromUserId: 'b', toUserId: 'a', amount: new Decimal(4) },
      { fromUserId: 'c', toUserId: 'a', amount: new Decimal(6) },
    ]);
  });
});
