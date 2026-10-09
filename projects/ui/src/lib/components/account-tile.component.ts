import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type BofaAccountKind = 'checking' | 'savings' | 'credit' | 'investment';

@Component({
  selector: 'bofa-account-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="bofa-account-tile" [class.credit]="kind === 'credit'" (click)="select.emit()">
      <div class="row">
        <mat-icon class="kind-icon">{{ icon }}</mat-icon>
        <div class="meta">
          <div class="name">{{ name }}</div>
          <div class="number">{{ accountNumber | bofaMask }}</div>
        </div>
      </div>
      <div class="balance">{{ balance | bofaAmount }}</div>
      <div class="label">{{ kind === 'credit' ? 'Current balance' : 'Available balance' }}</div>
    </mat-card>
  `,
  styles: [`
    .bofa-account-tile { cursor: pointer; transition: box-shadow .15s ease; }
    .bofa-account-tile:hover { box-shadow: 0 6px 18px rgba(1, 33, 105, .18); }
    .row { display: flex; gap: 12px; align-items: center; }
    .kind-icon { color: #012169; }
    .name { font-weight: 600; }
    .number { color: #5a6275; font-size: 13px; }
    .balance { font-size: 26px; font-weight: 600; margin-top: 16px; color: #012169; }
    .credit .balance { color: #e31837; }
    .label { color: #5a6275; font-size: 12px; }
  `]
})
export class BofaAccountTileComponent {
  @Input() name = '';
  @Input() accountNumber = '';
  @Input() balance = 0;
  @Input() kind: BofaAccountKind = 'checking';
  @Output() select = new EventEmitter<void>();

  get icon(): string {
    return { checking: 'account_balance', savings: 'savings', credit: 'credit_card', investment: 'trending_up' }[this.kind];
  }
}
