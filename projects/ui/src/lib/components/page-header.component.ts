import { Component, Input } from '@angular/core';

@Component({
  selector: 'bofa-page-header',
  template: `
    <header class="bofa-page-header">
      <div>
        <p class="eyebrow" *ngIf="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p class="subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <div class="actions"><ng-content></ng-content></div>
    </header>
  `,
  styles: [`
    .bofa-page-header { display: flex; justify-content: space-between; align-items: flex-end; margin: 8px 0 24px; }
    h1 { margin: 0; font-size: 26px; color: #012169; }
    .eyebrow { margin: 0 0 4px; text-transform: uppercase; font-size: 12px; letter-spacing: .08em; color: #e31837; }
    .subtitle { margin: 4px 0 0; color: #5a6275; }
  `]
})
export class BofaPageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() eyebrow?: string;
}
