import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TransferComponent } from './transfer.component';

@NgModule({
  declarations: [TransferComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: TransferComponent }])],
})
export class TransfersModule {}
