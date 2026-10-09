import { Component, EventEmitter, Input, Output } from '@angular/core';

export type BofaAlertLevel = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'bofa-alert-banner',
  template: `
    <div class="bofa-alert" [ngClass]="'bofa-alert--' + level" role="alert">
      <mat-icon>{{ icons[level] }}</mat-icon>
      <span class="msg"><ng-content></ng-content></span>
      <button mat-icon-button *ngIf="dismissible" aria-label="Dismiss" (click)="dismissed.emit()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .bofa-alert { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; }
    .msg { flex: 1; }
    .bofa-alert--info { background: #e6eaf1; color: #012169; }
    .bofa-alert--success { background: #e5f4ea; color: #1e6b3a; }
    .bofa-alert--warning { background: #fff4e0; color: #8a5300; }
    .bofa-alert--error { background: #fbe5e8; color: #b10617; }
  `]
})
export class BofaAlertBannerComponent {
  @Input() level: BofaAlertLevel = 'info';
  @Input() dismissible = false;
  @Output() dismissed = new EventEmitter<void>();
  readonly icons: Record<BofaAlertLevel, string> = { info: 'info', success: 'check_circle', warning: 'warning', error: 'error' };
}
