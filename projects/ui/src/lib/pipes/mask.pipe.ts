import { Pipe, PipeTransform } from '@angular/core';

/** Masks an account/card number, keeping only the last `visible` digits (PII). */
@Pipe({ name: 'bofaMask' })
export class BofaMaskPipe implements PipeTransform {
  transform(value: string | null | undefined, visible = 4): string {
    if (!value) {
      return '';
    }
    const digits = value.replace(/\D/g, '');
    if (digits.length <= visible) {
      return digits;
    }
    return '••••' + digits.slice(-visible);
  }
}
