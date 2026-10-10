import { Component, Input } from '@angular/core';

@Component({
  selector: 'dbs-page-header',
  template: `
    <header class="dbs-page-header">
      <div>
        <p class="eyebrow" *ngIf="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p class="subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <div class="actions"><ng-content></ng-content></div>
    </header>
  `,
  styles: [`
    .dbs-page-header { display: flex; justify-content: space-between; align-items: flex-end; margin: 8px 0 24px; }
    h1 { margin: 0; font-size: 26px; color: #1A1A1A; }
    .eyebrow { margin: 0 0 4px; text-transform: uppercase; font-size: 12px; letter-spacing: .08em; color: #EC1C24; }
    .subtitle { margin: 4px 0 0; color: #5A5A5A; }
  `]
})
export class DbsPageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() eyebrow?: string;
}
