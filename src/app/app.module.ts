import { DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnalyticsModule } from '@bofa-demo/analytics-sdk';
import { BofaUiModule } from '@bofa-demo/ui';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { ShellComponent } from './shell.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [ShellComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    BofaUiModule,
    AnalyticsModule.forRoot({ appId: 'digital-banking-web', endpoint: environment.analyticsEndpoint, debug: !environment.production }),
  ],
  providers: [{ provide: DATE_PIPE_DEFAULT_TIMEZONE, useValue: '-0500' }],
  bootstrap: [ShellComponent],
})
export class AppModule {}
