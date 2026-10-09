import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BofaToastService } from '@bofa-demo/ui';
import { Account, Payee } from '../../core/models';
import { AccountsService } from '../../core/services/accounts.service';
import { PaymentsService } from '../../core/services/payments.service';

@Component({
  selector: 'app-bill-pay',
  templateUrl: './bill-pay.component.html',
  styles: ['.layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; } .payee { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eef1f6; cursor: pointer; } .payee.selected { color: #012169; font-weight: 600; }'],
})
export class BillPayComponent implements OnInit {
  payees: Payee[] = [];
  accounts: Account[] = [];
  selected?: Payee;
  readonly minDate = new Date();

  form = this.fb.group({
    fromAccountId: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(1)]],
    deliverBy: [null as Date | null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private payments: PaymentsService,
    private accountsService: AccountsService,
    private toast: BofaToastService
  ) {}

  ngOnInit(): void {
    this.payments.payees().subscribe(p => (this.payees = p));
    this.accountsService.list().subscribe(a => (this.accounts = a.filter(x => x.kind === 'checking' || x.kind === 'savings')));
  }

  choose(p: Payee): void {
    this.selected = p;
  }

  pay(): void {
    if (!this.selected || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    this.payments
      .payBill({
        payeeId: this.selected.id,
        fromAccountId: v.fromAccountId ?? '',
        amount: Number(v.amount),
        deliverBy: (v.deliverBy ?? new Date()).toISOString(),
      })
      .subscribe({
        next: c => {
          this.toast.show(`Payment to ${this.selected?.name} scheduled. Confirmation ${c.confirmationNumber}.`);
          this.form.reset();
          this.selected = undefined;
        },
        error: () => this.toast.show('Payment could not be scheduled — insufficient available funds.'),
      });
  }
}
