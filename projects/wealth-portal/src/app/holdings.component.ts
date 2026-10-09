import { Component } from '@angular/core';

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  price: number;
}

@Component({
  selector: 'wp-holdings',
  template: `
    <bofa-page-header eyebrow="Merrill Edge (demo)" title="Portfolio holdings" subtitle="Self-directed brokerage"></bofa-page-header>
    <bofa-alert-banner level="info">Market data delayed 15 minutes.</bofa-alert-banner>
    <div class="tiles">
      <bofa-account-tile name="Brokerage" accountNumber="7Q2100448" kind="investment" [balance]="total"></bofa-account-tile>
    </div>
    <table mat-table [dataSource]="holdings" class="mat-elevation-z1">
      <ng-container matColumnDef="symbol">
        <th mat-header-cell *matHeaderCellDef>Symbol</th>
        <td mat-cell *matCellDef="let h">{{ h.symbol }}</td>
      </ng-container>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let h">{{ h.name }}</td>
      </ng-container>
      <ng-container matColumnDef="value">
        <th mat-header-cell *matHeaderCellDef>Market value</th>
        <td mat-cell *matCellDef="let h">{{ h.shares * h.price | bofaAmount }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>
  `,
  styles: ['.tiles { max-width: 320px; margin-bottom: 24px; } table { width: 100%; }'],
})
export class HoldingsComponent {
  readonly columns = ['symbol', 'name', 'value'];
  readonly holdings: Holding[] = [
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', shares: 120, price: 301.12 },
    { symbol: 'AGG', name: 'iShares Core US Aggregate Bond ETF', shares: 200, price: 99.4 },
    { symbol: 'BAC', name: 'Bank of America Corp', shares: 350, price: 49.87 },
  ];

  get total(): number {
    return this.holdings.reduce((sum, h) => sum + h.shares * h.price, 0);
  }
}
