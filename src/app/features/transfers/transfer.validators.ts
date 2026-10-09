import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Account } from '../../core/models';

/** Group validator: source and destination must differ and the amount must be covered by available funds. */
export function transferValidator(getAccounts: () => Account[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const from = group.get('fromAccountId')?.value;
    const to = group.get('toAccountId')?.value;
    const amount = Number(group.get('amount')?.value);
    const errors: ValidationErrors = {};
    if (from && to && from === to) {
      errors['sameAccount'] = true;
    }
    const source = getAccounts().find(a => a.id === from);
    if (source && amount > source.available) {
      errors['insufficientFunds'] = { available: source.available };
    }
    return Object.keys(errors).length ? errors : null;
  };
}
