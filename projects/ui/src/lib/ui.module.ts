import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BofaAccountTileComponent } from './components/account-tile.component';
import { BofaAlertBannerComponent } from './components/alert-banner.component';
import { BofaPageHeaderComponent } from './components/page-header.component';
import { BofaToastComponent } from './components/toast.component';
import { BofaAmountPipe } from './pipes/amount.pipe';
import { BofaMaskPipe } from './pipes/mask.pipe';

const DECLARATIONS = [
  BofaPageHeaderComponent,
  BofaAccountTileComponent,
  BofaAlertBannerComponent,
  BofaToastComponent,
  BofaMaskPipe,
  BofaAmountPipe,
];

@NgModule({
  declarations: DECLARATIONS,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  exports: DECLARATIONS,
  entryComponents: [BofaToastComponent],
})
export class BofaUiModule {}
