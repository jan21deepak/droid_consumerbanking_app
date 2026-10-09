import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnalyticsModule } from '@dbs-demo/analytics-sdk';
import { DbsUiModule } from '@dbs-demo/ui';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HoldingsComponent } from './holdings.component';

/**
 * Downstream consumer of @dbs-demo/ui owned by a different team (Wealth & Investments).
 * Its build must stay green through any design-system upgrade.
 */
@NgModule({
  declarations: [AppComponent, HoldingsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatTableModule,
    DbsUiModule,
    AnalyticsModule.forRoot({ appId: 'wealth-portal', endpoint: '/api/analytics' }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
