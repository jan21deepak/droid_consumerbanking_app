import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BillPayComponent } from './bill-pay.component';

@NgModule({
  declarations: [BillPayComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: BillPayComponent }])],
})
export class BillPayModule {}
