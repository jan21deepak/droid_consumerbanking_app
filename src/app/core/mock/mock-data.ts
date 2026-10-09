import { Account, Payee, Transaction } from '../models';

export const MOCK_USER = {
  id: 'u-1001',
  firstName: 'Jordan',
  lastName: 'Rivera',
  email: 'jordan.rivera@example.com',
  lastLogin: '2026-10-06T21:14:00Z',
};

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'chk-01', name: 'Advantage Plus Checking', number: '4831002217', routingNumber: '026009593', kind: 'checking', balance: 8421.37, available: 8121.37 },
  { id: 'sav-01', name: 'Advantage Savings', number: '4831009922', routingNumber: '026009593', kind: 'savings', balance: 25210.0, available: 25210.0 },
  { id: 'cc-01', name: 'Customized Cash Rewards Visa', number: '4400123456789012', routingNumber: '', kind: 'credit', balance: -1284.55, available: 8715.45 },
  { id: 'inv-01', name: 'Self-Directed Brokerage', number: '7Q2-100448', routingNumber: '', kind: 'investment', balance: 61873.12, available: 3100.0 },
];

const merchants: Array<[string, string, number]> = [
  ['Payroll — ACME Corp', 'Income', 3250.0], ['Whole Foods Market', 'Groceries', -142.18], ['Shell Oil', 'Gas', -48.3],
  ['Netflix', 'Entertainment', -15.49], ['Con Edison', 'Utilities', -96.4], ['Zelle to Sam P.', 'Transfer', -60.0],
  ['Amazon Marketplace', 'Shopping', -73.99], ['Starbucks', 'Dining', -6.85], ['Uber', 'Travel', -24.1],
  ['CVS Pharmacy', 'Health', -18.22], ['Interest Payment', 'Income', 4.11], ['Verizon Wireless', 'Telecom', -85.0],
];

export function buildTransactions(): Transaction[] {
  const out: Transaction[] = [];
  const today = new Date('2026-10-07T12:00:00Z').getTime();
  MOCK_ACCOUNTS.forEach((acct, a) => {
    for (let i = 0; i < 18; i++) {
      const [description, category, amount] = merchants[(i + a * 3) % merchants.length];
      out.push({
        id: `${acct.id}-t${i}`,
        accountId: acct.id,
        date: new Date(today - i * 86400000 * 1.6).toISOString(),
        description,
        category,
        amount: acct.kind === 'credit' ? -Math.abs(amount) : amount,
        pending: i < 2,
      });
    }
  });
  return out;
}

export const MOCK_PAYEES: Payee[] = [
  { id: 'p-1', name: 'Con Edison', category: 'utilities', accountNumber: '220044189' },
  { id: 'p-2', name: 'Verizon Wireless', category: 'telecom', accountNumber: '880011234' },
  { id: 'p-3', name: 'GEICO Auto Insurance', category: 'insurance', accountNumber: '5512-773' },
  { id: 'p-4', name: 'Chase Sapphire', category: 'credit card', accountNumber: '4147090011223344' },
];
