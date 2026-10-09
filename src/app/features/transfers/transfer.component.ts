import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from '@bofa-demo/analytics-sdk';
import { Account, Confirmation } from '../../core/models';
import { AccountsService } from '../../core/services/accounts.service';
import { PaymentsService } from '../../core/services/payments.service';
import { transferValidator } from './transfer.validators';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styles: ['.row > * { flex: 1; } .done { text-align: center; padding: 24px 0; } .done mat-icon { font-size: 48px; height: 48px; width: 48px; color: #1e6b3a; }'],
})
export class TransferComponent implements OnInit {
  accounts: Account[] = [];
  confirmation?: Confirmation;
  submitting = false;
  error = '';
  readonly minDate = new Date();

  form = this.fb.group(
    {
      fromAccountId: ['', Validators.required],
      toAccountId: ['', Validators.required],
      amount: [null as number | null, [Validators.required, Validators.min(0.01), Validators.max(25000)]],
      date: [new Date(), Validators.required],
      memo: ['', Validators.maxLength(64)],
    },
    { validators: transferValidator(() => this.accounts) }
  );

  constructor(
    private fb: FormBuilder,
    private accountsService: AccountsService,
    private payments: PaymentsService,
    private analytics: AnalyticsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.accountsService.list().subscribe(list => {
      this.accounts = list.filter(a => a.kind !== 'investment');
      const from = this.route.snapshot.queryParamMap.get('from');
      if (from) {
        this.form.patchValue({ fromAccountId: from });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    this.submitting = true;
    this.error = '';
    this.payments
      .transfer({
        fromAccountId: v.fromAccountId ?? '',
        toAccountId: v.toAccountId ?? '',
        amount: Number(v.amount),
        date: (v.date ?? new Date()).toISOString(),
        memo: v.memo ?? undefined,
      })
      .subscribe({
        next: c => {
          this.confirmation = c;
          this.submitting = false;
          this.analytics.track('interaction', 'transfer_completed', { amount: Number(v.amount), accountNumber: v.fromAccountId });
        },
        error: () => {
          this.submitting = false;
          this.error = 'We could not complete this transfer. Please review the details and try again.';
        },
      });
  }

  reset(): void {
    this.confirmation = undefined;
    this.form.reset({ date: new Date() });
    this.ngOnInit();
  }
}
