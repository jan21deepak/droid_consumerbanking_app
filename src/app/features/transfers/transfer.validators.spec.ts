import { FormControl, FormGroup } from '@angular/forms';
import { Account } from '../../core/models';
import { transferValidator } from './transfer.validators';

describe('transferValidator', () => {
  const accounts = [
    { id: 'a', available: 100 },
    { id: 'b', available: 0 },
  ] as Account[];

  const build = (from: string, to: string, amount: number) =>
    new FormGroup(
      { fromAccountId: new FormControl(from), toAccountId: new FormControl(to), amount: new FormControl(amount) },
      { validators: transferValidator(() => accounts) }
    );

  it('rejects transfers to the same account', () => {
    expect(build('a', 'a', 10).errors).toEqual({ sameAccount: true });
  });

  it('rejects amounts above available funds', () => {
    expect(build('a', 'b', 150).errors).toEqual({ insufficientFunds: { available: 100 } });
  });

  it('accepts a valid transfer', () => {
    expect(build('a', 'b', 100).errors).toBeNull();
  });
});
