import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/** USD amount formatting used across all Digital Banking surfaces. Negative values render as -$1,234.56. */
@Pipe({ name: 'bofaAmount' })
export class BofaAmountPipe implements PipeTransform {
  private currency = new CurrencyPipe('en-US');

  transform(value: number | null | undefined, showSign = false): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '—';
    }
    const formatted = this.currency.transform(Math.abs(value), 'USD', 'symbol', '1.2-2') ?? '';
    if (value < 0) {
      return '-' + formatted;
    }
    return showSign && value > 0 ? '+' + formatted : formatted;
  }
}
