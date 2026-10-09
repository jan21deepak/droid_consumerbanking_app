import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FdpMarketWidgetModule } from '@fdp/market-widget';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [SharedModule, FdpMarketWidgetModule, RouterModule.forChild([{ path: '', component: DashboardComponent }])],
})
export class DashboardModule {}
