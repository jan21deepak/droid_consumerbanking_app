import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DbsAccountTileComponent } from './components/account-tile.component';
import { DbsAlertBannerComponent } from './components/alert-banner.component';
import { DbsPageHeaderComponent } from './components/page-header.component';
import { DbsToastComponent } from './components/toast.component';
import { DbsAmountPipe } from './pipes/amount.pipe';
import { DbsMaskPipe } from './pipes/mask.pipe';

const DECLARATIONS = [
  DbsPageHeaderComponent,
  DbsAccountTileComponent,
  DbsAlertBannerComponent,
  DbsToastComponent,
  DbsMaskPipe,
  DbsAmountPipe,
];

@NgModule({
  declarations: DECLARATIONS,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  exports: DECLARATIONS,
  entryComponents: [DbsToastComponent],
})
export class DbsUiModule {}
