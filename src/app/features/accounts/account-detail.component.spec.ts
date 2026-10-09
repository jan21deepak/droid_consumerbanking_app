import { Transaction } from '../../core/models';
import { filterTransactions } from './account-detail.component';

describe('filterTransactions', () => {
  const txns = [
    { id: '1', description: 'Whole Foods Market', category: 'Groceries' },
    { id: '2', description: 'Shell Oil', category: 'Gas' },
  ] as Transaction[];

  it('returns everything for an empty query', () => {
    expect(filterTransactions(txns, '  ').length).toBe(2);
  });

  it('matches description or category, case-insensitively', () => {
    expect(filterTransactions(txns, 'whole').map(t => t.id)).toEqual(['1']);
    expect(filterTransactions(txns, 'GAS').map(t => t.id)).toEqual(['2']);
  });
});
