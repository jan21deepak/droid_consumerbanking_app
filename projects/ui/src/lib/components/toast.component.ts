import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bofa-toast',
  template: `
    <div class="bofa-toast" role="status">
      <mat-icon>notifications</mat-icon>
      <span>{{ message }}</span>
      <button mat-button color="accent" (click)="closed.emit()">OK</button>
    </div>
  `,
  styles: [`
    .bofa-toast { position: fixed; right: 24px; bottom: 24px; z-index: 1000; display: flex; gap: 12px; align-items: center;
      background: #012169; color: #fff; padding: 8px 8px 8px 16px; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.25); }
  `]
})
export class BofaToastComponent {
  @Input() message = '';
  @Output() closed = new EventEmitter<void>();
}
